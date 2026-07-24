import { Repository } from 'typeorm';
import { NewsletterSubscriber } from './entities/newsletter-subscriber.entity';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
import { UpdateSubscriberStatusDto } from './dto/update-subscriber-status.dto';
export declare class NewsletterService {
    private readonly subscriberRepo;
    constructor(subscriberRepo: Repository<NewsletterSubscriber>);
    subscribe(dto: SubscribeNewsletterDto): Promise<{
        message: string;
    }>;
    getAll(): Promise<NewsletterSubscriber[]>;
    unsubscribeByToken(token: string): Promise<{
        message: string;
    }>;
    updateStatus(id: string, dto: UpdateSubscriberStatusDto): Promise<NewsletterSubscriber>;
}
