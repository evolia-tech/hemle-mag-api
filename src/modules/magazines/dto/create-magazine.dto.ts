import { Type, Transform, Expose } from 'class-transformer';
import {
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
  IsDate,
  IsString,
} from 'class-validator';

class SectionDto {
  @Expose()
  @IsString()
  title: string;

  @Expose()
  @IsString()
  description: string;
}

export class CreateMagazineDto {

  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsString()
  number: string;

  @IsString()
  summary: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @Type(() => Date)
  @IsDate()
  releaseDate: Date;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isPublished: boolean;

  @IsOptional()
  @Transform(({ value }) => {
    // Si la valeur est une chaîne (FormData), on la parse
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return [];
      }
    }
    return value;
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionDto) // Re-convertit les objets simples en instances de SectionDto
  sections: SectionDto[];
}