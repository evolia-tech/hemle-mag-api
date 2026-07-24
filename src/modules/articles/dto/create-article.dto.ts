import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ArticleStatus } from '../enums/article-status.enum';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty({ message: "Le titre de l'article ne peut pas être vide." })
  title: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsOptional()
  content?: any;

  @IsString()
  @IsOptional()
  coverImageUrl?: string;

  @IsEnum(ArticleStatus)
  @IsOptional()
  status?: ArticleStatus;
}
