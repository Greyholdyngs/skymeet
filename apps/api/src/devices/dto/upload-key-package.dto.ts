import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UploadKeyPackageDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    keyPackageId: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    cipherSuite: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100000)
    encodedKeyPackage: string;
}