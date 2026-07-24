import { BaseEntity } from '../../../database/base.entity';
import { NewsletterSubscriberStatus } from '../enums/newsletter-subscriber-status.enum';
export declare class NewsletterSubscriber extends BaseEntity {
    email: string;
    status: NewsletterSubscriberStatus;
    unsubscribeToken: string;
    firstName: string | null;
    subscribedAt: Date | null;
    unsubscribedAt: Date | null;
}
