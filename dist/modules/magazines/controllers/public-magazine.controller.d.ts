import { MagazinesService } from "../magazines.service";
export declare class PublicMagazinesController {
    private readonly magazinesService;
    constructor(magazinesService: MagazinesService);
    findAllPublished(): Promise<(Partial<import("../entities/magazine.entity").Magazine> & {
        coverImage: string | null;
    })[]>;
    findLatest(): Promise<{
        coverImage: string | null;
        slug: string;
        number: string;
        title: string;
        subtitle?: string | null;
        summary: string;
        price: number;
        releaseDate: Date;
        isPublished: boolean;
        sections: import("../entities/magazine.entity").MagazineSection[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: Date | null;
        createdById?: string;
        updatedById?: string;
    }>;
    findOne(slug: string): Promise<{
        coverImage: string | null;
        slug: string;
        number: string;
        title: string;
        subtitle?: string | null;
        summary: string;
        price: number;
        releaseDate: Date;
        sections: import("../entities/magazine.entity").MagazineSection[];
        id: string;
    }>;
    downloadWithToken(token: string): Promise<{
        url: {
            url: string;
        };
    }>;
}
