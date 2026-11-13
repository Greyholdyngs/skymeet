import { Injectable, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ProjectMember, ProjectMemberDocument, ProjectMemberRole } from './schemas/project-member.schema.js';
import { Project, ProjectDocument } from '../projects/schema/project.schema.js';
import { User, UserDocument } from '../auth/schemas/user.schema.js';

import type { Connection } from 'mongoose';

@Injectable()
export class ProjectMembersService {
    constructor(
        @InjectModel(ProjectMember.name)
        private readonly projectMemberModel: Model<ProjectMemberDocument>,

        @InjectModel(Project.name)
        private readonly projectModel: Model<ProjectDocument>,

        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,

        @InjectConnection()
        private readonly connection: Connection,
    ) {}

    async createOwner( projectId: Types.ObjectId, userId: Types.ObjectId ): Promise<ProjectMemberDocument> {
        return this.projectMemberModel.create({
            projectId,
            userId,
            role: ProjectMemberRole.OWNER,
        });
    }

    async findByProject( projectId: Types.ObjectId ): Promise<ProjectMemberDocument[]> {
        return this.projectMemberModel.find({ projectId }).populate( 'userId', 'firstName lastName userName').sort({ createdAt: 1 }).exec();
    }

    async countByProject( projectId: Types.ObjectId ): Promise<number> {
        return this.projectMemberModel.countDocuments({ projectId });
    }

    async canAccessProject( projectId: Types.ObjectId, userId: Types.ObjectId ): Promise<boolean> {
        const [membership, ownedProject] = await Promise.all([
            this.projectMemberModel.exists({ projectId, userId }).exec(),

            this.projectModel.exists({ _id: projectId, ownerId: userId }).exec(),
        ]);

        return Boolean(membership || ownedProject);
    }

    async getRoleInProject( projectId: Types.ObjectId, userId: Types.ObjectId ): Promise<ProjectMemberRole | null> {
        
        const project = await this.projectModel.findById(projectId).select('ownerId').exec();

        if (!project) {
            return null;
        }

        if (project.ownerId.equals(userId)) {
            return ProjectMemberRole.OWNER;
        }

        const membership = await this.projectMemberModel.findOne({ projectId, userId }).select('role').exec();
        return membership?.role ?? null;
    }

    async canViewHistoricalChat( projectId: Types.ObjectId, userId: Types.ObjectId, ): Promise<{ allowed: boolean; joinedAt: Date | null }> {
        const membership = await this.projectMemberModel.findOne({ projectId, userId }).select('canViewHistoricalChat createdAt').exec();

        if (membership) {
            return {
                allowed: membership.canViewHistoricalChat ?? true,
                joinedAt: membership.createdAt,
            };
        }

        const isOwner = await this.projectModel.exists({ _id: projectId, ownerId: userId, }).exec();

        if (isOwner) {
            return { allowed: true, joinedAt: null };
        }

        throw new ForbiddenException('You are not a member of this project');
    }

    async findAccessibleProjectIds( userId: Types.ObjectId ): Promise<Types.ObjectId[]> {
        const [memberProjectIds, ownedProjectIds] = await Promise.all([
            this.projectMemberModel.distinct('projectId', { userId }).exec(),
            this.projectModel.distinct('_id', { ownerId: userId }).exec(),
        ]);

        const uniqueIds = new Map<string, Types.ObjectId>();

        for (const id of [...memberProjectIds, ...ownedProjectIds]) {
            uniqueIds.set(id.toString(), id as Types.ObjectId);
        }

        return [...uniqueIds.values()];
    }

    async findMemberIds( projectId: Types.ObjectId ): Promise<Types.ObjectId[]> {
        const ids = await this.projectMemberModel.distinct('userId', { projectId }).exec();
        return ids as Types.ObjectId[];
    }

    async transferOwnership( projectId: Types.ObjectId, currentOwnerId: Types.ObjectId,
                             email: string, ): Promise<{ message: string }> {

        const normalizedEmail = email.trim().toLowerCase();
        const session = await this.connection.startSession();

        try {
            await session.withTransaction(async () => {
                const project = await this.projectModel.findOne({ _id: projectId, ownerId: currentOwnerId,}).session(session).exec();

                if (!project) {
                    throw new ForbiddenException( 'Only the current project owner can transfer ownership.',);
                }
                const newOwner = await this.userModel.findOne({ email: normalizedEmail,}).select('_id').session(session).exec();

                if (!newOwner) {
                    throw new NotFoundException( 'No SkyMeet account exists with this email.', );
                }

                if (newOwner._id.equals(currentOwnerId)) {
                    throw new ConflictException( 'You are already the project owner.', );
                }

                const previousOwnerMembership = await this.projectMemberModel
                                                    .findOne({ projectId, userId: currentOwnerId }).session(session).exec();

                if (previousOwnerMembership) {
                    previousOwnerMembership.role = ProjectMemberRole.ADMIN;
                    await previousOwnerMembership.save({ session });
                } else {
                    await this.projectMemberModel.create([{
                        projectId,
                        userId: currentOwnerId,
                        role: ProjectMemberRole.ADMIN,
                        canViewHistoricalChat: true,
                    }], { session });
                }

                const newOwnerMembership = await this.projectMemberModel.findOne({ projectId, userId: newOwner._id }).session(session).exec();

                if (newOwnerMembership) {
                    newOwnerMembership.role = ProjectMemberRole.OWNER;
                    newOwnerMembership.canViewHistoricalChat = true;
                    await newOwnerMembership.save({ session });
                    
                } else {
                    await this.projectMemberModel.create([{
                        projectId,
                        userId: newOwner._id,
                        role: ProjectMemberRole.OWNER,
                        canViewHistoricalChat: true,
                    }], { session });
                }

                // Update the actual project owner.
                project.ownerId = newOwner._id;
                await project.save({ session });
            });
        } finally {
            await session.endSession();
        }

        return {
            message: 'Project ownership transferred successfully.',
        };
    }

    async leaveProject( projectId: Types.ObjectId, userId: Types.ObjectId ): Promise<{ message: string }> {
        const project = await this.projectModel.findById(projectId).select('ownerId').exec();

        if (!project) {
            throw new NotFoundException('Project not found.');
        }

        if (project.ownerId.equals(userId)) {
            throw new ForbiddenException( 'Transfer project ownership before leaving this project.' );
        }
        const membership = await this.projectMemberModel.findOneAndDelete({ projectId, userId }).exec();

        if (!membership) {
            throw new NotFoundException('Project membership not found.');
        }

        return { message: 'You have left the project successfully.' };
    }

    async removeMember( projectId: Types.ObjectId, actorId: Types.ObjectId,
                         memberUserId: Types.ObjectId, ): Promise<{ message: string }> {

        if (actorId.equals(memberUserId)) {
            throw new ForbiddenException( 'Use the leave project action to remove yourself.' );
        }

        const project = await this.projectModel.findById(projectId).select('ownerId').exec();

        if (!project) {
            throw new NotFoundException('Project not found.');
        }

        if (project.ownerId.equals(memberUserId)) {
            throw new ForbiddenException('The project owner cannot be removed.');
        }

        const actorMembership = await this.projectMemberModel.findOne({
            projectId,
            userId: actorId,
        }).select('role').exec();

        const targetMembership = await this.projectMemberModel.findOne({
            projectId,
            userId: memberUserId,
        }).select('role').exec();

        if (!targetMembership) {
            throw new NotFoundException('Project member not found.');
        }

        if (!actorMembership) {
            throw new ForbiddenException('You are not a project member.');
        }

        const isOwner = project.ownerId.equals(actorId);
        const isAdmin = actorMembership.role === ProjectMemberRole.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new ForbiddenException( 'Only project owners and admins can remove members.', );
        }

        if (isAdmin && targetMembership.role !== ProjectMemberRole.TEAM_MEMBER) {
            throw new ForbiddenException('Admins can only remove team members.', );
        }

        await this.projectMemberModel.deleteOne({
            projectId,
            userId: memberUserId,
        }).exec();

        return { message: 'Project member removed successfully.' };
    }

    async addMember( projectId: Types.ObjectId, userId: Types.ObjectId,
                     role: ProjectMemberRole.ADMIN | ProjectMemberRole.TEAM_MEMBER, ): Promise<ProjectMemberDocument> {
        try {
            const project = await this.projectModel.findById(projectId).select('ownerId showChatHistoryToNewMembers').exec();

            if (!project) {
                throw new ConflictException('Project no longer exists.');
            }

            let canViewHistoricalChat = project.showChatHistoryToNewMembers;

            if (canViewHistoricalChat === null || canViewHistoricalChat === undefined) {
                const owner = await this.userModel.findById(project.ownerId).select('preferences.showChatHistoryToNewMembers').exec();

                canViewHistoricalChat = owner?.preferences?.showChatHistoryToNewMembers ?? true;
            }

            return await this.projectMemberModel.create({
                projectId,
                userId,
                role,
                canViewHistoricalChat,
            });
        } catch (error: unknown) {
            if ( typeof error === 'object' && error !== null && 'code' in error && error.code === 11000 ) {
                throw new ConflictException( 'This user is already a member of the project.' );
            }

            throw error;
        }
    }
}

