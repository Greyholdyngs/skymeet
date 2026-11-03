import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ProjectMember, ProjectMemberDocument, ProjectMemberRole } from './schemas/project-member.schema.js';
import { Project, ProjectDocument } from '../projects/schema/project.schema.js';

@Injectable()
export class ProjectMembersService {
    constructor(
        @InjectModel(ProjectMember.name)
        private readonly projectMemberModel: Model<ProjectMemberDocument>,

        @InjectModel(Project.name)
        private readonly projectModel: Model<ProjectDocument>,
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

    async findMemberIds( projectId: Types.ObjectId ): Promise<Types.ObjectId[]> {
        const ids = await this.projectMemberModel.distinct('userId', { projectId }).exec();
        return ids as Types.ObjectId[];
    }

    async addMember( projectId: Types.ObjectId, userId: Types.ObjectId,
             role: ProjectMemberRole.ADMIN | ProjectMemberRole.TEAM_MEMBER ): Promise<ProjectMemberDocument> {

        try {
            return await this.projectMemberModel.create({ projectId, userId, role });
        } catch (error: unknown) {
            
            if ( typeof error === 'object' && error !== null && 'code' in error && error.code === 11000 ) {
            throw new ConflictException( 'This user is already a member of the project.' );
            }

            throw error;
        }
    }
}

