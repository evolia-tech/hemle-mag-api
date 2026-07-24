import { PartialType, OmitType } from '@nestjs/mapped-types';
import {
  IsString,
  IsOptional,
  MinLength,
  Matches,
} from 'class-validator';
import { CreateStaffDto } from './create-staff.dto';

/**
 * DTO de mise à jour standard (tout optionnel, sauf password exclu).
 * Pour changer le mot de passe, utiliser ChangePasswordDto.
 */
export class UpdateStaffDto extends PartialType(
  OmitType(CreateStaffDto, ['password'] as const),
) {}

/**
 * DTO dédié au changement de mot de passe.
 * Nécessite l'ancien mot de passe pour confirmer l'identité.
 */
export class ChangePasswordDto {
  @IsString()
  @IsOptional()
  currentPassword?: string;

  @IsString()
  @MinLength(8, { message: 'Le nouveau mot de passe doit faire au moins 8 caractères.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre.',
  })
  newPassword: string;
}