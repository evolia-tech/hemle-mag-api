import { NewsletterService } from './newsletter.service';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
import { UpdateSubscriberStatusDto } from './dto/update-subscriber-status.dto';
export declare class NewsletterController {
    private readonly newsletterService;
    constructor(newsletterService: NewsletterService);
    subscribe(dto: SubscribeNewsletterDto): Promise<{
        message: string;
    }>;
    unsubscribeByToken(token: string): Promise<{
        message: string;
    }>;
    getAll(): Promise<import("./entities/newsletter-subscriber.entity").NewsletterSubscriber[]>;
    updateStatus(id: string, dto: UpdateSubscriberStatusDto): Promise<import("./entities/newsletter-subscriber.entity").NewsletterSubscriber>;
}
