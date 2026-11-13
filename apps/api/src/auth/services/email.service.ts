import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
    private readonly resend: Resend;
    private readonly logger = new Logger(EmailService.name);

    constructor(private readonly configService: ConfigService) {
        const apiKey = this.configService.get<string>('RESEND_API_KEY');

        if (!apiKey) {
            throw new Error('RESEND_API_KEY is not configured');
        }

        this.resend = new Resend(apiKey);
    }

    async sendEmail(to: string, subject: string, html: string ): Promise<void> {
        const result = await this.resend.emails.send({
            from: this.configService.getOrThrow<string>('EMAIL_FROM'),
            to,
            subject,
            html,
        });

        if (result.error) {
            this.logger.error(`Email delivery failed: ${result.error.message}`);

            throw new InternalServerErrorException( 'Unable to send email at this time. Please try again later.',);
        }

    }
}