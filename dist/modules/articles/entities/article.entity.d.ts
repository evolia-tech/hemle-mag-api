import { BaseEntity } from '../../../database/base.entity';
import { ArticleStatus } from '../enums/article-status.enum';
import { Staff } from '../../staffs/entities/staff.entity';
export declare class Article extends BaseEntity {
    title: string;
    slug: string;
    summary: string | null;
    content: any | null;
    coverImageUrl: string | null;
    status: ArticleStatus;
    publishedAt: Date | null;
    author: Staff | null;
    authorId: string | null;
}
