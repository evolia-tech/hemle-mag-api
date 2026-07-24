import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { NewsletterService } from '../newsletter/newsletter.service';
export declare class ArticlesService {
    private readonly articleRepository;
    private readonly configService;
    private readonly mailService;
    private readonly newsletterService;
    constructor(articleRepository: Repository<Article>, configService: ConfigService, mailService: MailService, newsletterService: NewsletterService);
    create(dto: CreateArticleDto, authorId: string): Promise<Article>;
    findAllPublic(): Promise<Article[]>;
    findAllAdmin(): Promise<Article[]>;
    findOneById(id: string): Promise<Article>;
    findOneBySlug(slug: string): Promise<Article>;
    update(id: string, dto: UpdateArticleDto): Promise<Article>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    private triggerNewsletterBroadcast;
    private generateUniqueSlug;
}
