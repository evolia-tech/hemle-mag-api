declare class SectionDto {
    title: string;
    description: string;
}
export declare class CreateMagazineDto {
    title: string;
    slug: string;
    number: string;
    summary: string;
    price: number;
    releaseDate: Date;
    isPublished: boolean;
    sections: SectionDto[];
}
export {};
