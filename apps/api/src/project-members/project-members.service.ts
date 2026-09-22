import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ProjectMember, ProjectMemberDocument } from './schemas/project-member.schema.js';
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
            role: 'owner',
        });
    }

    async findByProject( projectId: Types.ObjectId ): Promise<ProjectMemberDocument[]> {
        return this.projectMemberModel.find({ projectId }).populate( 'userId', 'firstName lastName userName email').sort({ createdAt: 1 }).exec();
    }

    async countByProject( projectId: Types.ObjectId ): Promise<number> {
        return this.projectMemberModel.countDocuments({ projectId });
    }

    async canAccessProject( projectId: Types.ObjectId, userId: Types.ObjectId ): Promise<boolean> {
        const project = await this.projectModel.findOne({_id: projectId, ownerId: userId}).select('_id').lean().exec();

        return !!project;
    }
}

