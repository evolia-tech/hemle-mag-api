import {
  Entity,
  Column,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../../database/base.entity';
import { NewsletterSubscriberStatus } from '../enums/newsletter-subscriber-status.enum';

@Entity('newsletter_subscribers')
export class NewsletterSubscriber extends BaseEntity {
  /**
   * Adresse email de l'abonné. Indexée et unique.
   */
  @Index({ unique: true })
  @Column({ type: 'varchar', unique: true })
  email: string;

  /**
   * Statut de l'abonnement.
   * SUBSCRIBED = actif | UNSUBSCRIBED = désabonné | PENDING = en attente
   */
  @Column({
    type: 'enum',
    enum: NewsletterSubscriberStatus,
    default: NewsletterSubscriberStatus.SUBSCRIBED,
  })
  status: NewsletterSubscriberStatus;

  /**
   * Token unique pour désabonnement sans connexion.
   * Utilisé via : GET /newsletter/unsubscribe?token=xxx
   */
  @Column({ name: 'unsubscribe_token', type: 'varchar', unique: true })
  unsubscribeToken: string;

  /**
   * Prénom de l'abonné (optionnel). Permet la personnalisation des emails.
   */
  @Column({ name: 'first_name', type: 'varchar', nullable: true })
  firstName: string | null;

  /**
   * Date d'inscription. Obligatoire pour la conformité RGPD.
   */
  @Column({ name: 'subscribed_at', type: 'timestamptz', nullable: true })
  subscribedAt: Date | null;

  /**
   * Date de désabonnement. NULL si toujours abonné.
   * On ne supprime jamais l'entrée — on la marque désabonnée.
   */
  @Column({ name: 'unsubscribed_at', type: 'timestamptz', nullable: true })
  unsubscribedAt: Date | null;
}
