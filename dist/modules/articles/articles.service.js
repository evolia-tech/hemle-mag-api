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
exports.ArticlesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const article_entity_1 = require("./entities/article.entity");
const article_status_enum_1 = require("./enums/article-status.enum");
const config_1 = require("@nestjs/config");
const mail_service_1 = require("../mail/mail.service");
const newsletter_service_1 = require("../newsletter/newsletter.service");
const newsletter_subscriber_status_enum_1 = require("../newsletter/enums/newsletter-subscriber-status.enum");
let ArticlesService = class ArticlesService {
    articleRepository;
    configService;
    mailService;
    newsletterService;
    constructor(articleRepository, configService, mailService, newsletterService) {
        this.articleRepository = articleRepository;
        this.configService = configService;
        this.mailService = mailService;
        this.newsletterService = newsletterService;
    }
    async create(dto, authorId) {
        const slug = await this.generateUniqueSlug(dto.title);
        const article = this.articleRepository.create({
            ...dto,
            slug,
            authorId,
            publishedAt: dto.status === article_status_enum_1.ArticleStatus.PUBLISHED ? new Date() : null,
        });
        const saved = await this.articleRepository.save(article);
        if (saved.status === article_status_enum_1.ArticleStatus.PUBLISHED) {
            await this.triggerNewsletterBroadcast(saved);
        }
        return saved;
    }
    async findAllPublic() {
        return this.articleRepository.find({
            where: { status: article_status_enum_1.ArticleStatus.PUBLISHED },
            relations: ['author'],
            order: { publishedAt: 'DESC' },
        });
    }
    async findAllAdmin() {
        return this.articleRepository.find({
            relations: ['author'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOneById(id) {
        const article = await this.articleRepository.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!article) {
            throw new common_1.NotFoundException(`Article avec l'ID ${id} introuvable.`);
        }
        return article;
    }
    async findOneBySlug(slug) {
        const article = await this.articleRepository.findOne({
            where: { slug, status: article_status_enum_1.ArticleStatus.PUBLISHED },
            relations: ['author'],
        });
        if (!article) {
            throw new common_1.NotFoundException(`Article introuvable.`);
        }
        return article;
    }
    async update(id, dto) {
        const article = await this.findOneById(id);
        const oldStatus = article.status;
        let slug = article.slug;
        if (dto.title && dto.title !== article.title) {
            slug = await this.generateUniqueSlug(dto.title, id);
        }
        let publishedAt = article.publishedAt;
        if (dto.status === article_status_enum_1.ArticleStatus.PUBLISHED && oldStatus !== article_status_enum_1.ArticleStatus.PUBLISHED) {
            publishedAt = new Date();
        }
        else if (dto.status === article_status_enum_1.ArticleStatus.DRAFT) {
            publishedAt = null;
        }
        Object.assign(article, dto, { slug, publishedAt });
        const updated = await this.articleRepository.save(article);
        if (updated.status === article_status_enum_1.ArticleStatus.PUBLISHED && oldStatus !== article_status_enum_1.ArticleStatus.PUBLISHED) {
            await this.triggerNewsletterBroadcast(updated);
        }
        return updated;
    }
    async remove(id) {
        const article = await this.findOneById(id);
        await this.articleRepository.remove(article);
        return { success: true };
    }
    async triggerNewsletterBroadcast(article) {
        try {
            const subscribers = await this.newsletterService.getAll();
            const activeSubscribers = subscribers.filter((sub) => sub.status === newsletter_subscriber_status_enum_1.NewsletterSubscriberStatus.SUBSCRIBED);
            if (activeSubscribers.length === 0) {
                return;
            }
            const frontendUrl = this.configService.get('frontend.url');
            const articleUrl = `${frontendUrl}/blog/${article.slug}`;
            const emailPromises = activeSubscribers.map((sub) => {
                const unsubscribeUrl = `${frontendUrl}/desabonnement?token=${sub.unsubscribeToken}`;
                return this.mailService.sendNewsletterBroadcast(sub.email, {
                    articleTitle: article.title,
                    articleSummary: article.summary,
                    articleCoverUrl: article.coverImageUrl,
                    articleUrl,
                    unsubscribeUrl,
                });
            });
            await Promise.all(emailPromises);
            console.log(`✉️ Newsletter envoyée avec succès à ${activeSubscribers.length} abonnés.`);
        }
        catch (error) {
            console.error(`❌ Échec du broadcast de la newsletter : ${error.message}`);
        }
    }
    async generateUniqueSlug(title, excludeArticleId) {
        const baseSlug = title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        let slug = baseSlug;
        let counter = 1;
        while (true) {
            const query = this.articleRepository.createQueryBuilder('article')
                .where('article.slug = :slug', { slug });
            if (excludeArticleId) {
                query.andWhere('article.id != :id', { id: excludeArticleId });
            }
            const exists = await query.getOne();
            if (!exists) {
                break;
            }
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
        return slug;
    }
};
exports.ArticlesService = ArticlesService;
exports.ArticlesService = ArticlesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(article_entity_1.Article)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService,
        mail_service_1.MailService,
        newsletter_service_1.NewsletterService])
], ArticlesService);
//# sourceMappingURL=articles.service.js.map