import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { DocumentType } from '../schemas/document.schema.js';

export class CreateDocumentLinkDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(150)
    title: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string;

    @IsEnum(DocumentType)
    type: DocumentType;

    @IsUrl({
        protocols: ['http', 'https'],
        require_protocol: true,
    })
    @MaxLength(2048)
    externalUrl: string;
}