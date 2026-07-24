"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const handlebars = __importStar(require("handlebars"));
let MailService = MailService_1 = class MailService {
    transporter;
    configService;
    logger = new common_1.Logger(MailService_1.name);
    constructor(transporter, configService) {
        this.transporter = transporter;
        this.configService = configService;
    }
    async sendMail(to, subject, html) {
        const from = this.configService.get('mail.from');
        try {
            await this.transporter.sendMail({
                from,
                to,
                subject,
                html
            });
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${to}: ${error.message}`, error.stack);
            return false;
        }
    }
    async sendMagazinesOrder(to, customerName, items) {
        try {
            const subject = 'Votre commande HEMLE MAG';
            const templatePath = path.join(__dirname, 'templates', 'order-confirmation.hbs');
            const templateSource = fs.readFileSync(templatePath, 'utf8');
            const template = handlebars.compile(templateSource);
            const html = template({
                customerName,
                items,
                currentYear: new Date().getFullYear(),
            });
            return this.sendMail(to, subject, html);
        }
        catch (error) {
            this.logger.error(`Failed to generate or send magazine order email: ${error.message}`, error.stack);
            return false;
        }
    }
    async sendNewsletterBroadcast(to, data) {
        try {
            const subject = `HEMLE MAG — Nouvel article : ${data.articleTitle}`;
            const templatePath = path.join(__dirname, 'templates', 'newsletter-broadcast.hbs');
            const templateSource = fs.readFileSync(templatePath, 'utf8');
            const template = handlebars.compile(templateSource);
            const html = template({
                articleTitle: data.articleTitle,
                articleSummary: data.articleSummary,
                articleCoverUrl: data.articleCoverUrl,
                articleUrl: data.articleUrl,
                unsubscribeUrl: data.unsubscribeUrl,
                currentYear: new Date().getFullYear(),
            });
            return this.sendMail(to, subject, html);
        }
        catch (error) {
            this.logger.error(`Failed to generate or send newsletter broadcast email to ${to}: ${error.message}`, error.stack);
            return false;
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('MAIL_TRANSPORTER')),
    __metadata("design:paramtypes", [Object, config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map