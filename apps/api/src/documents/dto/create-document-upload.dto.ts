import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

import { DocumentType } from '../schemas/document.schema.js';

export class CreateDocumentUploadDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    title: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string;

    @IsEnum(DocumentType)
    type: DocumentType;
}