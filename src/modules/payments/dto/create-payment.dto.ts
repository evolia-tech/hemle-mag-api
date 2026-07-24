// src/modules/payments/dto/create-payment.dto.ts

import { IsEmail, IsString, IsArray, ValidateNested, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentProviderEnum } from '../enums/payment-provider.enum';

/**
 * DTO pour les items de paiement
 * Chaque item = un magazine à acheter
 */
class PaymentItemDto {
  /**
   * ID du magazine (UUID)
   * Utilisé pour récupérer le vrai prix en base
   */
  @IsString()
  magazineId: string;

  /**
   * Quantité à acheter
   * Généralement 1 pour un magazine
   */
  @Min(1)
  quantity: number;
}

/**
 * DTO pour la création d'un paiement
 * Reçu du frontend (page-magazines-detail)
 */
export class CreatePaymentDto {
  /**
   * Fournisseur de paiement
   * Exemple : 'stripe', 'paypal'
   */
  @IsEnum(PaymentProviderEnum, { message: 'Le fournisseur de paiement doit être valide (stripe ou paypal).' })
  provider: PaymentProviderEnum;

  /**
   * Email du client
   * Utilisé pour :
   * - Facture Stripe
   * - Email de confirmation
   * - Récupération future de la commande
   */
  @IsEmail()
  customerEmail: string;

  /**
   * Prénom du client
   * Obligatoire pour la facturation
   */
  @IsString()
  firstName: string;

  /**
   * Nom du client
   * Obligatoire pour la facturation
   */
  @IsString()
  lastName: string;

  /**
   * Téléphone du client
   * Obligatoire pour la facturation
   */
  @IsString()
  phone: string;

  /**
   * Devise du paiement
   * Exemple : 'EUR', 'USD'
   */
  @IsString()
  currency: string;

  /**
   * Articles à acheter
   * Contient les IDs des magazines
   * Les prix seront récupérés en base
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentItemDto)
  items: PaymentItemDto[];
}

export class CreateCheckoutPageDto {
  @IsEnum(PaymentProviderEnum, { message: 'Le fournisseur de paiement doit être valide (stripe ou paypal).' })
  provider?: PaymentProviderEnum;

  @IsString()
  currency?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentItemDto)
  items: PaymentItemDto[];
}