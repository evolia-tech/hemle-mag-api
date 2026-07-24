// src/modules/orders/dto/create-order.dto.ts

import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateOrderDto {
    @IsNumber({}, { message: "Le montant total doit être un nombre." })
    @IsNotEmpty()
    totalAmount: number;

    @IsString()
    @IsNotEmpty()
    currency: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsString()
    @IsNotEmpty({ message: "Le moyen de paiement est obligatoire." })
    paymentMethod: string; // 'CARD', 'CASH', etc.

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ message: "La liste des IDs de magazines ne peut pas être vide." })
    magazineIds: string[];

    @IsUUID('4', { message: "L'ID du client doit être un UUID valide." })
    @IsNotEmpty({ message: "L'ID du client est obligatoire." })
    customerId: string; // L'Admin ou le Webhook fournira cet ID préalablement créé/récupéré
}