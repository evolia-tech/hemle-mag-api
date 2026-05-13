import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../database/base.entity';

export interface MagazineSection {
  title: string;
  description: string;
}

const priceTransformer = {
  to: (value: number) => value,
  from: (value: string): number => Number(value),
};

@Entity('magazines')
export class Magazine extends BaseEntity {
  @Column({
    type: 'varchar',
    unique: true,
  })
  slug: string;

  @Column({
    type: 'varchar',
  })
  number: string;

  @Column({
    type: 'varchar',
  })
  title: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  subtitle?: string | null;

  @Column({
    type: 'text',
  })
  summary: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: priceTransformer,
  })
  price: number;

  @Column({
    name: 'release_date',
    type: 'date',
  })
  releaseDate: Date;

  @Column({
    name: 'is_published',
    type: 'boolean',
    default: false,
  })
  isPublished: boolean;

  @Column({
    type: 'jsonb',
    default: () => "'[]'::jsonb",
  })
  sections: MagazineSection[];
}