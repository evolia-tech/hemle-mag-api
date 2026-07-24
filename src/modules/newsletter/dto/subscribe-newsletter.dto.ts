import { IsEmail, IsNotEmpty } from 'class-validator';

export class SubscribeNewsletterDto {
  @IsEmail({}, { message: 'Veuillez fournir une adresse email valide.' })
  @IsNotEmpty()
  email: string;
}
