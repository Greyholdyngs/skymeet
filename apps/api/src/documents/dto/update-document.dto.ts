import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { DocumentType } from '../schemas/document.schema.js';

export class UpdateDocumentDto {
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(150)
    title?: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string;

    @IsOptional()
    @IsEnum(DocumentType)
    type?: DocumentType;
}