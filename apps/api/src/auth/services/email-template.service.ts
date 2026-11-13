type OtpEmailPurpose = 'email_verification' | 'password_reset' | 'email_change';

interface OtpEmailContent {
    subject: string;
    heading: string;
    message: string;
    securityNotice: string;
}

export class EmailTemplateService {
    private static readonly content: Record<OtpEmailPurpose, OtpEmailContent> = {
        email_verification: {
            subject: 'Your SkyMeet verification code',
            heading: 'Verify your email address',
            message: 'Welcome to SkyMeet. Use the verification code below to confirm your email address and get started.',
            securityNotice: 'If you did not create a SkyMeet account, you can safely ignore this email.',
        },
        password_reset: {
            subject: 'Your SkyMeet Password Reset Code',
            heading: 'Reset your password',
            message: 'We received a request to reset your SkyMeet password. Use the code below to continue.',
            securityNotice: 'If you did not request a password reset, you can safely ignore this email.',
        },
        email_change: {
            subject: 'Your SkyMeet email change code',
            heading: 'Verify your new email address',
            message: 'Use the verification code below to confirm your new email address.',
            securityNotice: 'If you did not request this email change, please secure your account.',
        },
    };

    static otpEmail( purpose: OtpEmailPurpose, otp: string, logoUrl: string, ): { subject: string; html: string } {
        const content = this.content[purpose];

        return {
            subject: content.subject,
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta name="color-scheme" content="dark">
                    <meta name="supported-color-schemes" content="dark">
                    <title>${content.subject}</title>
                </head>
                <body style="margin:0;padding:0;background-color:#050711;font-family:Arial,Helvetica,sans-serif;color:#E8EDF2;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#0B0C10;padding:40px 16px;">
                        <tr>
                            <td align="center">
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:520px;background-color:#050711;border:1px solid #252D38;border-radius:12px;">
                                    <tr>
                                        <td align="center" style="padding:36px 32px 24px;">
                                            <img src="${logoUrl}" alt="SkyMeet" width="180" style="display:block;width:180px;max-width:100%;height:auto;border:0;">
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:12px 32px 8px;">
                                            <h1 style="margin:0;color:#FFFFFF;font-size:25px;line-height:1.4;font-weight:700;">
                                                ${content.heading}
                                            </h1>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:8px 32px 24px;">
                                            <p style="margin:0;color:#AAB4C2;font-size:15px;line-height:1.7;">
                                                ${content.message}
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" style="padding:0 32px 24px;">
                                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#181521;border:1px solid #27272A;border-radius:10px;">
                                                <tr>
                                                    <td align="center" style="padding:24px 16px;">
                                                        <p style="margin:0 0 12px;color:#8995A4;font-size:11px;letter-spacing:2px;font-weight:700;">
                                                            YOUR VERIFICATION CODE
                                                        </p>
                                                        <p style="margin:0;color:#00A1CC;font-size:34px;line-height:1.4;font-weight:700;letter-spacing:8px;">
                                                            ${otp}
                                                        </p>
                                                        <p style="margin:12px 0 0;color:#8995A4;font-size:12px;">
                                                            Expires in 5 minutes
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:0 32px 32px;">
                                            <p style="margin:0;color:#AAB4C2;font-size:13px;line-height:1.7;">
                                                ${content.securityNotice}
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" style="padding:22px 24px;border-top:1px solid #252D38;">
                                            <p style="margin:0;color:#778392;font-size:12px;line-height:1.7;">
                                                © ${new Date().getFullYear()} SkyMeet<br>
                                                Work together, without the friction.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `,
        };
    }
}
