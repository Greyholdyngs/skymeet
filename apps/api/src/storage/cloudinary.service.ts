
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

import { Readable } from 'node:stream';

@Injectable()
export class CloudinaryService {
    constructor(configService: ConfigService) {
        cloudinary.config({
            cloud_name: configService.getOrThrow<string>('CLOUDINARY_CLOUD_NAME'),
            api_key: configService.getOrThrow<string>('CLOUDINARY_API_KEY'),
            api_secret: configService.getOrThrow<string>('CLOUDINARY_API_SECRET'),
            secure: true,
        });
    }

    async uploadBuffer( buffer: Buffer, folder: string,): Promise<{ publicId: string; resourceType: string;
                        format: string; bytes: number; }> {

        return new Promise((resolve, reject) => {
            const upload = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: 'auto',
                    type: 'authenticated',
                    use_filename: true,
                    unique_filename: true,
                },
                (error, result) => {
                    if (error || !result) {
                        reject(error ?? new Error('Cloudinary upload failed.'));
                        return;
                    }

                    resolve({
                        publicId: result.public_id,
                        resourceType: result.resource_type,
                        format: result.format,
                        bytes: result.bytes,
                    });
                },
            );

            Readable.from(buffer).pipe(upload);
        });
    }

    async createDownloadUrl( publicId: string, resourceType: string, format: string ): Promise<string> {
        return cloudinary.utils.private_download_url(
            publicId,
            format,
            {
                resource_type: resourceType as 'image' | 'raw' | 'video',
                type: 'authenticated',
                expires_at: Math.floor(Date.now() / 1000) + 300,
            },
        );
    }

    async deleteAsset( publicId: string, resourceType: string ): Promise<void> {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType as 'image' | 'raw' | 'video',
            type: 'authenticated',
        });

        if (result.result !== 'ok' && result.result !== 'not found') {
            throw new Error('Cloudinary asset deletion failed.');
        }
    }
}

