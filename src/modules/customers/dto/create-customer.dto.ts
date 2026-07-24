// src/modules/customers/dto/create-customer.dto.ts

import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
    @IsEmail({}, { message: "L'adresse e-mail fournie n'est pas valide." })
    @IsNotEmpty({ message: "L'adresse e-mail est obligatoire." })
    email: string;

    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    country?: string;
}