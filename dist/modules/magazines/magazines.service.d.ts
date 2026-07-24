import { DataSource, Repository } from 'typeorm';
import { Magazine } from './entities/magazine.entity';
import { MediaService } from '../media/media.service';
import { CreateMagazineDto } from './dto/create-magazine.dto';
import { UpdateMagazineDto } from './dto/update-magazine.dto';
import { Media } from '../media/entities/media.entity';
import { JwtService } from '@nestjs/jwt';
export declare class MagazinesService {
    private readonly magazineRepository;
    private readonly jwtService;
    private readonly mediaService;
    private readonly dataSource;
    private readonly mediaRepository;
    constructor(magazineRepository: Repository<Magazine>, jwtService: JwtService, mediaService: MediaService, dataSource: DataSource, mediaRepository: Repository<Media>);
    create(dto: CreateMagazineDto, coverFile: Express.Multer.File | undefined, pdfFile: Express.Multer.File | undefined): Promise<Magazine>;
    update(id: string, dto: UpdateMagazineDto, file: Express.Multer.File | undefined): Promise<Magazine>;
    findAll(): Promise<Magazine[]>;
    findAllWithMedia(): Promise<Magazine[]>;
    findByIdForPayment(id: string): Promise<{
        id: string;
        title: string;
        price: number;
        coverImage: string | null;
        currency: string;
    }>;
    findOneWithMedia(id: string): Promise<{
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
        sections: import("./entities/magazine.entity").MagazineSection[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: Date | null;
        createdById?: string;
        updatedById?: string;
    }>;
    findAllPublishedWithMedia(): Promise<(Partial<Magazine> & {
        coverImage: string | null;
    })[]>;
    findBySlug(slug: string): Promise<{
        coverImage: string | null;
        slug: string;
        number: string;
        title: string;
        subtitle?: string | null;
        summary: string;
        price: number;
        releaseDate: Date;
        sections: import("./entities/magazine.entity").MagazineSection[];
        id: string;
    }>;
    findLatestPublished(): Promise<{
        coverImage: string | null;
        slug: string;
        number: string;
        title: string;
        subtitle?: string | null;
        summary: string;
        price: number;
        releaseDate: Date;
        isPublished: boolean;
        sections: import("./entities/magazine.entity").MagazineSection[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: Date | null;
        createdById?: string;
        updatedById?: string;
    }>;
    remove(id: string): Promise<void>;
    findByIds(ids: string[]): Promise<Magazine[]>;
    downloadWithToken(token: string): Promise<{
        url: {
            url: string;
        };
    }>;
    generateDownloadToken(magazineId: string): string;
}
