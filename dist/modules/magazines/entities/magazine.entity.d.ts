import { BaseEntity } from '../../../database/base.entity';
export interface MagazineSection {
    title: string;
    description: string;
}
export declare class Magazine extends BaseEntity {
    slug: string;
    number: string;
    title: string;
    subtitle?: string | null;
    summary: string;
    price: number;
    releaseDate: Date;
    isPublished: boolean;
    sections: MagazineSection[];
}
