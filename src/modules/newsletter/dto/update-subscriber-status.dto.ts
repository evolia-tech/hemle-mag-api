import { IsEnum, IsNotEmpty } from 'class-validator';
import { NewsletterSubscriberStatus } from '../enums/newsletter-subscriber-status.enum';

export class UpdateSubscriberStatusDto {
  @IsEnum(NewsletterSubscriberStatus)
  @IsNotEmpty()
  status: NewsletterSubscriberStatus;
}
