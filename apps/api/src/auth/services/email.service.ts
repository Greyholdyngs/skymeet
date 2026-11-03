import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
    private readonly resend: Resend;

    constructor(private readonly configService: ConfigService) {
        const apiKey = this.configService.get<string>('RESEND_API_KEY');

        if (!apiKey) {
            throw new Error('RESEND_API_KEY is not configured');
        }

        this.resend = new Resend(apiKey);
    }

    async sendEmail(to: string, subject: string, html: string ): Promise<void> {
        console.log('Attempting to send email to:', to);
        const result = await this.resend.emails.send({
            from: 'SkyMeet <onboarding@resend.dev>',
            to,
            subject,
            html,
        });

        console.log('Resend result:', result);

        if (result.error) {
            throw new InternalServerErrorException( `Resend error: ${result.error.message}` );
        }

        console.log('Email sent. Resend ID:', result.data?.id);
    }
}