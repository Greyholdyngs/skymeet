import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Project, ProjectDocument, } from './schema/project.schema.js';
import { ProjectMember, ProjectMemberDocument } from '../project-members/schemas/project-member.schema.js';
@Injectable()
export class ProjectsService {
    constructor(
        @InjectModel(Project.name)
        private readonly projectModel: Model<ProjectDocument>,

        @InjectModel(ProjectMember.name)
        private readonly projectMemberModel: Model<ProjectMemberDocument>,
    ) {}

    async create(
        name: string,
        description: string,
        ownerId: Types.ObjectId,
    ): Promise<ProjectDocument> {

        const project = new this.projectModel({
            name,
            description,
            ownerId,
        });

        return project.save();
    }

    async findByOwner( ownerId: Types.ObjectId ) {
        const projects = await this.projectModel.find({ ownerId }).sort({ createdAt: -1 }).lean().exec();

        return Promise.all(
            projects.map(async (project) => {
                const membersCount = await this.projectMemberModel.countDocuments({ projectId: project._id });

                return {
                    ...project,
                    membersCount,
                };
            }),
        );
    }

    async findById( projectId: Types.ObjectId, ownerId: Types.ObjectId ): Promise<ProjectDocument | null> {
        return this.projectModel.findOne({_id: projectId, ownerId }).exec();
    }

    async update(
        projectId: Types.ObjectId,
        ownerId: Types.ObjectId,
        updates: {
            name?: string;
            description?: string;
        },
    ): Promise<ProjectDocument | null> {

        return this.projectModel.findOneAndUpdate({ _id: projectId, ownerId },{$set: updates }, { new: true, runValidators: true, } ).exec();
    }

    async delete( projectId: Types.ObjectId, ownerId: Types.ObjectId ): Promise<ProjectDocument | null> {
        return this.projectModel.findOneAndDelete({_id: projectId, ownerId }).exec();
    }
}