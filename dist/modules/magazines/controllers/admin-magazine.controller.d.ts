import { MagazinesService } from '../magazines.service';
export declare class AdminMagazinesController {
    private readonly magazinesService;
    constructor(magazinesService: MagazinesService);
    findAll(): Promise<import("../entities/magazine.entity").Magazine[]>;
    findOne(id: string): Promise<{
        coverImage: string | null;
        pdfFile: string | null;
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
    create(files: {
        coverImage?: Express.Multer.File[];
        pdfFile?: Express.Multer.File[];
    }, body: any): Promise<import("../entities/magazine.entity").Magazine>;
    update(id: string, file: Express.Multer.File, body: any): Promise<import("../entities/magazine.entity").Magazine>;
    remove(id: string): Promise<void>;
}
