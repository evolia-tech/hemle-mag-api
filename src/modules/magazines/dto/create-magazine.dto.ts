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

  @IsOptional()
  @IsString()
  subtitle?: string;

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
    if (typeof value === 'string') return JSON.parse(value);
    return value;
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionDto)
  sections: SectionDto[];
}