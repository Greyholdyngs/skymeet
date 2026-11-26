import { ForbiddenException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Document, DocumentDocument, DocumentResourceType } from './schemas/document.schema.js';
import { CreateDocumentLinkDto } from './dto/create-document-link.dto.js';
import { UpdateDocumentDto } from './dto/update-document.dto.js';

import { ProjectMembersService } from '../project-members/project-members.service.js';
import { ProjectMemberRole } from '../project-members/schemas/project-member.schema.js';
import { ActivityService } from '../activity/activity.service.js';

import { ActivityAction, ActivityEntityType, } from '../activity/activity.types.js';
import { CloudinaryService } from '../storage/cloudinary.service.js';
import { CreateDocumentUploadDto } from './dto/create-document-upload.dto.js';

import { fileTypeFromBuffer } from 'file-type';
import { fromBufferPromise } from 'yauzl';

@Injectable()
export class DocumentsService {
    constructor(
        @InjectModel(Document.name)
        private readonly documentModel: Model<DocumentDocument>,

        private readonly projectMembersService: ProjectMembersService,
        private readonly activityService: ActivityService,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    private async assertProjectAccess( projectId: Types.ObjectId, userId: Types.ObjectId ) {
        const role = await this.projectMembersService.getRoleInProject(
            projectId,
            userId,
        );

        if (!role) {
            throw new ForbiddenException( 'You do not have access to this project.',);
        }

        return role;
    }

    private assertCanManage( role: ProjectMemberRole, createdBy: Types.ObjectId, userId: Types.ObjectId ) {
        const isAdmin = [ ProjectMemberRole.OWNER, ProjectMemberRole.ADMIN,].includes(role);

        if (!isAdmin && !createdBy.equals(userId)) {
            throw new ForbiddenException('You cannot modify this resource.');
        }
    }

    private async validateFileContent( buffer: Buffer, mimeType: string, originalName: string,): Promise<void> {
        const extension = originalName.slice(originalName.lastIndexOf('.')).toLowerCase();
        const detected = await fileTypeFromBuffer(buffer);

        const expectedMimeTypes: Record<string, string> = {
            '.pdf': 'application/pdf',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
        };

        if (expectedMimeTypes[extension]) {
            if ( !detected || detected.mime !== expectedMimeTypes[extension] || mimeType !== expectedMimeTypes[extension]) {
                throw new BadRequestException('Invalid file content.');
            }

            return;
        }

        const officeTypes: Record<string, string> = {
            '.docx': 'word/document.xml',
            '.xlsx': 'xl/workbook.xml',
        };

        const requiredEntry = officeTypes[extension];

        if (!requiredEntry || detected?.mime !== 'application/zip') {
            throw new BadRequestException('Invalid Office document.');
        }

        const zip = await fromBufferPromise(buffer, {
            lazyEntries: true,
            validateEntrySizes: true,
        });

        let hasContentTypes = false;
        let hasRequiredEntry = false;

        try {
            for await (const entry of zip.eachEntry()) {
                if (entry.fileName === '[Content_Types].xml') {
                    hasContentTypes = true;
                }

                if (entry.fileName === requiredEntry) {
                    hasRequiredEntry = true;
                }

                if (hasContentTypes && hasRequiredEntry) {
                    break;
                }
            }
        } finally {
            zip.close();
        }

        if (!hasContentTypes || !hasRequiredEntry) {
            throw new BadRequestException('Invalid Office document structure.');
        }
    }

    async findByProject( projectId: Types.ObjectId, userId: Types.ObjectId ) {
        await this.assertProjectAccess(projectId, userId);
        return this.documentModel.find({ projectId }).populate('createdBy', 'firstName lastName userName').sort({ createdAt: -1 }).exec();
    }

    async createLink( projectId: Types.ObjectId, userId: Types.ObjectId, dto: CreateDocumentLinkDto ) {
        await this.assertProjectAccess(projectId, userId);

        const document = await this.documentModel.create({
            projectId,
            createdBy: userId,
            title: dto.title,
            description: dto.description ?? '',
            type: dto.type,
            resourceType: DocumentResourceType.LINK,
            externalUrl: dto.externalUrl,
        });

        await this.activityService.record({
            projectId,
            actorId: userId,
            entityType: ActivityEntityType.DOCUMENT,
            entityId: document._id,
            action: ActivityAction.DOCUMENT_CREATED,
            entityTitle: document.title,
        });

        return document;
    }

    async update( projectId: Types.ObjectId, documentId: Types.ObjectId, userId: Types.ObjectId, dto: UpdateDocumentDto, ) {
        const document = await this.documentModel.findById({_id: documentId, projectId}).exec();

        if (!document) {
            throw new NotFoundException('Document not found.');
        }

        const role = await this.assertProjectAccess(
            document.projectId,
            userId,
        );

        this.assertCanManage(role, document.createdBy, userId);

        Object.assign(document, dto);
        await document.save();

        await this.activityService.record({
            projectId: document.projectId,
            actorId: userId,
            entityType: ActivityEntityType.DOCUMENT,
            entityId: document._id,
            action: ActivityAction.DOCUMENT_UPDATED,
            entityTitle: document.title,
        });

        return document;
    }

    async delete(projectId: Types.ObjectId, documentId: Types.ObjectId, userId: Types.ObjectId ) {
        const document = await this.documentModel.findById({_id: documentId, projectId }).exec();

        if (!document) {
            throw new NotFoundException('Document not found.');
        }

        const role = await this.assertProjectAccess(
            document.projectId,
            userId,
        );

        this.assertCanManage(role, document.createdBy, userId);

        if (
            document.resourceType === DocumentResourceType.FILE &&
            document.storagePublicId
        ) {
            throw new Error('File deletion will be enabled with the storage integration.');
        }

        await document.deleteOne();

        await this.activityService.record({
            projectId: document.projectId,
            actorId: userId,
            entityType: ActivityEntityType.DOCUMENT,
            entityId: document._id,
            action: ActivityAction.DOCUMENT_DELETED,
            entityTitle: document.title,
        });

        return { message: 'Resource deleted successfully.' };
    }

    async createFile( projectId: Types.ObjectId, userId: Types.ObjectId, dto: CreateDocumentUploadDto,
                    file: { buffer: Buffer; originalname: string; mimetype: string; size: number; },) {

        await this.assertProjectAccess(projectId, userId);
        const folder = `skymeet/projects/${projectId}/documents`;

        const uploaded = await this.cloudinaryService.uploadBuffer( file.buffer, folder,);
        let document: DocumentDocument;

        try {
            document = await this.documentModel.create({
                projectId,
                createdBy: userId,
                title: dto.title,
                description: dto.description ?? '',
                type: dto.type,
                resourceType: DocumentResourceType.FILE,
                originalFileName: file.originalname,
                mimeType: file.mimetype,
                fileSize: uploaded.bytes,
                storagePublicId: uploaded.publicId,
                storageResourceType: uploaded.resourceType,
                storageFormat: uploaded.format,
            });
        } catch (error) {
            await this.cloudinaryService.deleteAsset( uploaded.publicId, uploaded.resourceType );

            throw error;
        }

        await this.validateFileContent(
            file.buffer,
            file.mimetype,
            file.originalname,
        );

        await this.activityService.record({
            projectId,
            actorId: userId,
            entityType: ActivityEntityType.DOCUMENT,
            entityId: document._id,
            action: ActivityAction.DOCUMENT_CREATED,
            entityTitle: document.title,
        });

        return document;
    }

    async getDownloadUrl( projectId: Types.ObjectId, documentId: Types.ObjectId, userId: Types.ObjectId, ) {
        await this.assertProjectAccess(projectId, userId);

        const document = await this.documentModel.findOne({
            _id: documentId,
            projectId,
            resourceType: DocumentResourceType.FILE,
        }).exec();

        if (!document) {
            throw new NotFoundException('File not found.');
        }

        if ( !document.storagePublicId || !document.storageResourceType || !document.storageFormat ) {
            throw new NotFoundException('Stored file is unavailable.');
        }

        const url = await this.cloudinaryService.createDownloadUrl(
            document.storagePublicId,
            document.storageResourceType,
            document.storageFormat,
        );

        return { url };
    }
}