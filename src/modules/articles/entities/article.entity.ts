import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../database/base.entity';
import { ArticleStatus } from '../enums/article-status.enum';
import { Staff } from '../../staffs/entities/staff.entity';

@Entity('articles')
export class Article extends BaseEntity {
  @Column({ type: 'varchar' })
  title: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  summary: string | null;

  /**
   * Contenu de l'article stocké en format JSON (Editor.js blocks)
   */
  @Column({ type: 'jsonb', nullable: true })
  content: any | null;

  @Column({ name: 'cover_image_url', type: 'varchar', nullable: true })
  coverImageUrl: string | null;

  @Column({
    type: 'enum',
    enum: ArticleStatus,
    default: ArticleStatus.DRAFT,
  })
  status: ArticleStatus;

  @Column({ name: 'published_at', type: 'timestamptz', nullable: true })
  publishedAt: Date | null;

  @ManyToOne(() => Staff, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'author_id' })
  author: Staff | null;

  @Column({ name: 'author_id', type: 'uuid', nullable: true })
  authorId: string | null;
}
