import { ArticleStatus } from '../enums/article-status.enum';
export declare class CreateArticleDto {
    title: string;
    summary?: string;
    content?: any;
    coverImageUrl?: string;
    status?: ArticleStatus;
}
