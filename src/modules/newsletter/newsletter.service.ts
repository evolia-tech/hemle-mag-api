import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { NewsletterSubscriber } from './entities/newsletter-subscriber.entity';
import { NewsletterSubscriberStatus } from './enums/newsletter-subscriber-status.enum';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
import { UpdateSubscriberStatusDto } from './dto/update-subscriber-status.dto';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectRepository(NewsletterSubscriber)
    private readonly subscriberRepo: Repository<NewsletterSubscriber>,
  ) {}

  /**
   * Inscription à la newsletter.
   * Si l'email existe et est UNSUBSCRIBED → le réactive.
   * Si l'email existe et est SUBSCRIBED → informe que déjà inscrit.
   * Sinon → création d'un nouvel abonné.
   */
  async subscribe(dto: SubscribeNewsletterDto): Promise<{ message: string }> {
    const email = dto.email.toLowerCase().trim();

    const existing = await this.subscriberRepo.findOne({
      where: { email },
    });

    if (existing) {
      if (existing.status === NewsletterSubscriberStatus.SUBSCRIBED) {
        return { message: 'Vous êtes déjà inscrit à notre newsletter.' };
      }

      // Réactivation si précédemment désabonné
      existing.status = NewsletterSubscriberStatus.SUBSCRIBED;
      existing.subscribedAt = new Date();
      existing.unsubscribedAt = null;
      await this.subscriberRepo.save(existing);
      return { message: 'Votre inscription a bien été réactivée.' };
    }

    // Nouvel abonné
    const subscriber = this.subscriberRepo.create({
      email,
      status: NewsletterSubscriberStatus.SUBSCRIBED,
      unsubscribeToken: randomBytes(32).toString('hex'),
      subscribedAt: new Date(),
    });

    await this.subscriberRepo.save(subscriber);
    return { message: 'Merci ! Vous êtes maintenant inscrit à notre newsletter.' };
  }

  /**
   * Récupère tous les abonnés (admin uniquement).
   */
  async getAll(): Promise<NewsletterSubscriber[]> {
    return this.subscriberRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Désabonnement public via token (lien dans l'email).
   */
  async unsubscribeByToken(token: string): Promise<{ message: string }> {
    if (!token) {
      throw new BadRequestException('Token de désabonnement manquant.');
    }

    const subscriber = await this.subscriberRepo.findOne({
      where: { unsubscribeToken: token },
    });

    if (!subscriber) {
      throw new NotFoundException('Lien de désabonnement invalide ou expiré.');
    }

    if (subscriber.status === NewsletterSubscriberStatus.UNSUBSCRIBED) {
      return { message: 'Vous êtes déjà désabonné.' };
    }

    subscriber.status = NewsletterSubscriberStatus.UNSUBSCRIBED;
    subscriber.unsubscribedAt = new Date();
    await this.subscriberRepo.save(subscriber);

    return { message: 'Vous avez bien été désabonné de notre newsletter.' };
  }

  /**
   * Mise à jour du statut par un admin.
   */
  async updateStatus(
    id: string,
    dto: UpdateSubscriberStatusDto,
  ): Promise<NewsletterSubscriber> {
    const subscriber = await this.subscriberRepo.findOne({ where: { id } });

    if (!subscriber) {
      throw new NotFoundException(`Abonné introuvable (id: ${id}).`);
    }

    subscriber.status = dto.status;

    if (dto.status === NewsletterSubscriberStatus.SUBSCRIBED) {
      subscriber.subscribedAt = new Date();
      subscriber.unsubscribedAt = null;
    } else if (dto.status === NewsletterSubscriberStatus.UNSUBSCRIBED) {
      subscriber.unsubscribedAt = new Date();
    }

    return this.subscriberRepo.save(subscriber);
  }
}
