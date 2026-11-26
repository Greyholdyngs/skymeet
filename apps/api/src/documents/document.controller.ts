import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Req, UseGuards, UploadedFile,
        BadRequestException, UseInterceptors} from '@nestjs/common';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';

import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { AuthRequest } from '../auth/types/auth-request.js';

import { DocumentsService } from './document.service.js';
import { CreateDocumentLinkDto } from './dto/create-document-link.dto.js';
import { CreateDocumentUploadDto } from './dto/create-document-upload.dto.js';

import { UpdateDocumentDto } from './dto/update-document.dto.js';
import { DOCUMENT_UPLOAD_OPTIONS } from './document-upload.config.js';

@Controller('projects/:projectId/documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
    constructor(
        private readonly documentsService: DocumentsService,
    ) {}

    @Get()
    async findByProject( @Param('projectId') projectId: string, @Req() request: AuthRequest ) {
        if (!Types.ObjectId.isValid(projectId)) {
            throw new NotFoundException('Project not found.');
        }

        return this.documentsService.findByProject(
            new Types.ObjectId(projectId),
            new Types.ObjectId(request.user.sub),
        );
    }

    @Post('files')
    @UseInterceptors(
        FileInterceptor('file', {
            ...DOCUMENT_UPLOAD_OPTIONS,
            storage: memoryStorage(),
        }),
    )
    async uploadFile( @Param('projectId') projectId: string, @Body() body: CreateDocumentUploadDto, @UploadedFile()
                    file: { buffer: Buffer; originalname: string; mimetype: string; size: number; } | undefined,
                    @Req() request: AuthRequest,) {

        if (!Types.ObjectId.isValid(projectId)) {
            throw new NotFoundException('Project not found.');
        }

        if (!file) {
            throw new BadRequestException('A document file is required.');
        }

        return this.documentsService.createFile(
            new Types.ObjectId(projectId),
            new Types.ObjectId(request.user.sub),
            body,
            file,
        );
    }

    @Post('links')
    async createLink( @Param('projectId') projectId: string, @Body() body: CreateDocumentLinkDto,
                    @Req() request: AuthRequest, ) {

        if (!Types.ObjectId.isValid(projectId)) {
            throw new NotFoundException('Project not found.');
        }

        return this.documentsService.createLink(
            new Types.ObjectId(projectId),
            new Types.ObjectId(request.user.sub),
            body,
        );
    }

    @Patch(':documentId')
    async update( @Param('projectId') projectId: string, @Param('documentId') documentId: string,
                @Body() body: UpdateDocumentDto, @Req() request: AuthRequest, ) {

        if ( !Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(documentId) ) {
            throw new NotFoundException('Document not found.');
        }

        return this.documentsService.update(
            new Types.ObjectId(projectId),
            new Types.ObjectId(documentId),
            new Types.ObjectId(request.user.sub),
            body,
        );
    }

    @Delete(':documentId')
    async delete( @Param('projectId') projectId: string, @Param('documentId') documentId: string,
                @Req() request: AuthRequest, ) {

        if ( !Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(documentId) ) {
            throw new NotFoundException('Document not found.');
        }

        return this.documentsService.delete(
            new Types.ObjectId(projectId),
            new Types.ObjectId(documentId),
            new Types.ObjectId(request.user.sub),
        );
    }

    @Get(':documentId/download')
    async getDownloadUrl( @Param('projectId') projectId: string, @Param('documentId') documentId: string,
                            @Req() request: AuthRequest, ) {

        if ( !Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(documentId)) {
            throw new NotFoundException('File not found.');
        }

        return this.documentsService.getDownloadUrl(
            new Types.ObjectId(projectId),
            new Types.ObjectId(documentId),
            new Types.ObjectId(request.user.sub),
        );
    }
}
