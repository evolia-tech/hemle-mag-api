import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleStatus } from './enums/article-status.enum';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { NewsletterService } from '../newsletter/newsletter.service';
import { NewsletterSubscriberStatus } from '../newsletter/enums/newsletter-subscriber-status.enum';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,

    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly newsletterService: NewsletterService,
  ) {}

  /**
   * Crée un nouvel article (Brouillon par défaut ou défini dans le DTO)
   */
  async create(dto: CreateArticleDto, authorId: string): Promise<Article> {
    const slug = await this.generateUniqueSlug(dto.title);
    
    const article = this.articleRepository.create({
      ...dto,
      slug,
      authorId,
      publishedAt: dto.status === ArticleStatus.PUBLISHED ? new Date() : null,
    });

    const saved = await this.articleRepository.save(article);

    // Si l'article est créé directement comme publié, on lance le broadcast
    if (saved.status === ArticleStatus.PUBLISHED) {
      await this.triggerNewsletterBroadcast(saved);
    }

    return saved;
  }

  /**
   * Récupère tous les articles pour l'affichage public (uniquement PUBLISHED, triés par date décroissante)
   */
  async findAllPublic(): Promise<Article[]> {
    return this.articleRepository.find({
      where: { status: ArticleStatus.PUBLISHED },
      relations: ['author'],
      order: { publishedAt: 'DESC' },
    });
  }

  /**
   * Récupère tous les articles pour l'administration (tous statuts, triés par date de création décroissante)
   */
  async findAllAdmin(): Promise<Article[]> {
    return this.articleRepository.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Récupère un article par son ID
   */
  async findOneById(id: string): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!article) {
      throw new NotFoundException(`Article avec l'ID ${id} introuvable.`);
    }

    return article;
  }

  /**
   * Récupère un article par son slug (Lecture publique)
   */
  async findOneBySlug(slug: string): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { slug, status: ArticleStatus.PUBLISHED },
      relations: ['author'],
    });

    if (!article) {
      throw new NotFoundException(`Article introuvable.`);
    }

    return article;
  }

  /**
   * Met à jour un article
   */
  async update(id: string, dto: UpdateArticleDto): Promise<Article> {
    const article = await this.findOneById(id);
    const oldStatus = article.status;

    // Regénérer le slug si le titre change
    let slug = article.slug;
    if (dto.title && dto.title !== article.title) {
      slug = await this.generateUniqueSlug(dto.title, id);
    }

    // Gestion de la date de publication
    let publishedAt = article.publishedAt;
    if (dto.status === ArticleStatus.PUBLISHED && oldStatus !== ArticleStatus.PUBLISHED) {
      publishedAt = new Date();
    } else if (dto.status === ArticleStatus.DRAFT) {
      publishedAt = null;
    }

    Object.assign(article, dto, { slug, publishedAt });
    const updated = await this.articleRepository.save(article);

    // Si on vient de publier l'article, on déclenche le broadcast
    if (updated.status === ArticleStatus.PUBLISHED && oldStatus !== ArticleStatus.PUBLISHED) {
      await this.triggerNewsletterBroadcast(updated);
    }

    return updated;
  }

  /**
   * Supprime un article
   */
  async remove(id: string): Promise<{ success: boolean }> {
    const article = await this.findOneById(id);
    await this.articleRepository.remove(article);
    return { success: true };
  }

  /**
   * Envoi de l'e-mail automatique aux inscrits de la newsletter (Broadcast)
   */
  private async triggerNewsletterBroadcast(article: Article): Promise<void> {
    try {
      const subscribers = await this.newsletterService.getAll();
      const activeSubscribers = subscribers.filter(
        (sub) => sub.status === NewsletterSubscriberStatus.SUBSCRIBED,
      );

      if (activeSubscribers.length === 0) {
        return;
      }

      const frontendUrl = this.configService.get<string>('frontend.url');
      const articleUrl = `${frontendUrl}/blog/${article.slug}`;

      // Envoi asynchrone à tous les destinataires
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
    } catch (error) {
      console.error(`❌ Échec du broadcast de la newsletter : ${error.message}`);
    }
  }

  /**
   * Générateur de slug unique
   */
  private async generateUniqueSlug(title: string, excludeArticleId?: string): Promise<string> {
    const baseSlug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // supprime les accents
      .replace(/[^a-z0-9]+/g, '-')     // remplace non-alphanumérique par des tirets
      .replace(/^-+|-+$/g, '');        // nettoie les tirets aux extrémités

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
}
