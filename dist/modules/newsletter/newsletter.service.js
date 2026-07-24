"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const newsletter_subscriber_entity_1 = require("./entities/newsletter-subscriber.entity");
const newsletter_subscriber_status_enum_1 = require("./enums/newsletter-subscriber-status.enum");
let NewsletterService = class NewsletterService {
    subscriberRepo;
    constructor(subscriberRepo) {
        this.subscriberRepo = subscriberRepo;
    }
    async subscribe(dto) {
        const email = dto.email.toLowerCase().trim();
        const existing = await this.subscriberRepo.findOne({
            where: { email },
        });
        if (existing) {
            if (existing.status === newsletter_subscriber_status_enum_1.NewsletterSubscriberStatus.SUBSCRIBED) {
                return { message: 'Vous êtes déjà inscrit à notre newsletter.' };
            }
            existing.status = newsletter_subscriber_status_enum_1.NewsletterSubscriberStatus.SUBSCRIBED;
            existing.subscribedAt = new Date();
            existing.unsubscribedAt = null;
            await this.subscriberRepo.save(existing);
            return { message: 'Votre inscription a bien été réactivée.' };
        }
        const subscriber = this.subscriberRepo.create({
            email,
            status: newsletter_subscriber_status_enum_1.NewsletterSubscriberStatus.SUBSCRIBED,
            unsubscribeToken: (0, crypto_1.randomBytes)(32).toString('hex'),
            subscribedAt: new Date(),
        });
        await this.subscriberRepo.save(subscriber);
        return { message: 'Merci ! Vous êtes maintenant inscrit à notre newsletter.' };
    }
    async getAll() {
        return this.subscriberRepo.find({
            order: { createdAt: 'DESC' },
        });
    }
    async unsubscribeByToken(token) {
        if (!token) {
            throw new common_1.BadRequestException('Token de désabonnement manquant.');
        }
        const subscriber = await this.subscriberRepo.findOne({
            where: { unsubscribeToken: token },
        });
        if (!subscriber) {
            throw new common_1.NotFoundException('Lien de désabonnement invalide ou expiré.');
        }
        if (subscriber.status === newsletter_subscriber_status_enum_1.NewsletterSubscriberStatus.UNSUBSCRIBED) {
            return { message: 'Vous êtes déjà désabonné.' };
        }
        subscriber.status = newsletter_subscriber_status_enum_1.NewsletterSubscriberStatus.UNSUBSCRIBED;
        subscriber.unsubscribedAt = new Date();
        await this.subscriberRepo.save(subscriber);
        return { message: 'Vous avez bien été désabonné de notre newsletter.' };
    }
    async updateStatus(id, dto) {
        const subscriber = await this.subscriberRepo.findOne({ where: { id } });
        if (!subscriber) {
            throw new common_1.NotFoundException(`Abonné introuvable (id: ${id}).`);
        }
        subscriber.status = dto.status;
        if (dto.status === newsletter_subscriber_status_enum_1.NewsletterSubscriberStatus.SUBSCRIBED) {
            subscriber.subscribedAt = new Date();
            subscriber.unsubscribedAt = null;
        }
        else if (dto.status === newsletter_subscriber_status_enum_1.NewsletterSubscriberStatus.UNSUBSCRIBED) {
            subscriber.unsubscribedAt = new Date();
        }
        return this.subscriberRepo.save(subscriber);
    }
};
exports.NewsletterService = NewsletterService;
exports.NewsletterService = NewsletterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(newsletter_subscriber_entity_1.NewsletterSubscriber)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NewsletterService);
//# sourceMappingURL=newsletter.service.js.map