import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';
import * as handlebars from 'handlebars';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    @Inject('MAIL_TRANSPORTER')
    private readonly transporter: nodemailer.Transporter,
    private readonly configService: ConfigService,
  ) { }

  /**
   * Envoi générique de mail
   */
  async sendMail(to: string, subject: string, html: string): Promise<boolean> {
    const from = this.configService.get<string>('mail.from');
    try {
      await this.transporter.sendMail({
        from,
        to,
        subject,
        html
      });
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`, error.stack);
      return false;
    }
  }

  /**
   * Envoi du mail de confirmation de commande avec les liens de téléchargement (via Handlebars)
   */
  async sendMagazinesOrder(
    to: string,
    customerName: string,
    items: { title: string; downloadUrl: string }[],
  ): Promise<boolean> {
    try {
      const subject = 'Votre commande HEMLE MAG';

      // Lecture du template Handlebars
      const templatePath = path.join(__dirname, 'templates', 'order-confirmation.hbs');
      const templateSource = fs.readFileSync(templatePath, 'utf8');
      const template = handlebars.compile(templateSource);

      // Compilation du HTML avec les variables dynamiques
      const html = template({
        customerName,
        items,
        currentYear: new Date().getFullYear(),
      });

      return this.sendMail(to, subject, html);
    } catch (error) {
      this.logger.error(`Failed to generate or send magazine order email: ${error.message}`, error.stack);
      return false;
    }
  }

  /**
   * Envoi du mail de newsletter broadcast (nouvel article publié)
   */
  async sendNewsletterBroadcast(
    to: string,
    data: {
      articleTitle: string;
      articleSummary: string | null;
      articleCoverUrl: string | null;
      articleUrl: string;
      unsubscribeUrl: string;
    },
  ): Promise<boolean> {
    try {
      const subject = `HEMLE MAG — Nouvel article : ${data.articleTitle}`;

      // Lecture du template Handlebars
      const templatePath = path.join(__dirname, 'templates', 'newsletter-broadcast.hbs');
      const templateSource = fs.readFileSync(templatePath, 'utf8');
      const template = handlebars.compile(templateSource);

      // Compilation du HTML
      const html = template({
        articleTitle: data.articleTitle,
        articleSummary: data.articleSummary,
        articleCoverUrl: data.articleCoverUrl,
        articleUrl: data.articleUrl,
        unsubscribeUrl: data.unsubscribeUrl,
        currentYear: new Date().getFullYear(),
      });

      return this.sendMail(to, subject, html);
    } catch (error) {
      this.logger.error(`Failed to generate or send newsletter broadcast email to ${to}: ${error.message}`, error.stack);
      return false;
    }
  }
}
