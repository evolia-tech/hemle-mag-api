import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
export declare class MailService {
    private readonly transporter;
    private readonly configService;
    private readonly logger;
    constructor(transporter: nodemailer.Transporter, configService: ConfigService);
    sendMail(to: string, subject: string, html: string): Promise<boolean>;
    sendMagazinesOrder(to: string, customerName: string, items: {
        title: string;
        downloadUrl: string;
    }[]): Promise<boolean>;
    sendNewsletterBroadcast(to: string, data: {
        articleTitle: string;
        articleSummary: string | null;
        articleCoverUrl: string | null;
        articleUrl: string;
        unsubscribeUrl: string;
    }): Promise<boolean>;
}
