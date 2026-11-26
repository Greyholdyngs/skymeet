import { BadRequestException } from '@nestjs/common';
import type { Request } from 'express';

const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;

const ALLOWED_DOCUMENT_TYPES = new Set([
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/png',
    'image/jpeg',
]);

const ALLOWED_EXTENSIONS = new Set([
    '.pdf','.docx','.xlsx','.png','.jpg','.jpeg',
]);

interface UploadFile {
    originalname: string;
    mimetype: string;
}

export const DOCUMENT_UPLOAD_OPTIONS = {
    limits: {
        fileSize: MAX_DOCUMENT_SIZE,
        files: 1,
    },
    fileFilter: ( _request: Request, file: UploadFile, callback: (error: Error | null, acceptFile: boolean) => void) => {
        const extension = file.originalname.slice(file.originalname.lastIndexOf('.')).toLowerCase();

        if ( !ALLOWED_DOCUMENT_TYPES.has(file.mimetype) || !ALLOWED_EXTENSIONS.has(extension) ) {
            callback(
                new BadRequestException('Unsupported document file type.'),
                false,
            );
            return;
        }

        callback(null, true);
    },
};
