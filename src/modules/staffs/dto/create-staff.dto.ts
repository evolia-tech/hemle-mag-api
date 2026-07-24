import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsArray,
  ArrayMinSize,
  ArrayUnique,
  MinLength,
  IsUrl,
  MaxLength,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Role } from '../enums/role.enum';

export class CreateStaffDto {
  @IsEmail({}, { message: 'Adresse email invalide.' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Le mot de passe doit faire au moins 8 caractères.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre.',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  /**
   * Liste des rôles attribués au membre.
   * Au minimum un rôle requis.
   */
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return value.split(',').map((s: string) => s.trim());
      }
    }
    return value;
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Au moins un rôle est requis.' })
  @ArrayUnique()
  @IsEnum(Role, { each: true, message: 'Rôle invalide.' })
  roles: Role[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  // ─── Champs auteur (optionnels) ─────────────────────────────────────────

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL d\'avatar invalide.' })
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  jobTitle?: string;
}