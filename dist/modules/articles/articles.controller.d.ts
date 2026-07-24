import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { MediaService } from '../media/media.service';
export declare class ArticlesController {
    private readonly articlesService;
    private readonly mediaService;
    constructor(articlesService: ArticlesService, mediaService: MediaService);
    findAllPublic(): Promise<import("./entities/article.entity").Article[]>;
    findAllAdmin(): Promise<import("./entities/article.entity").Article[]>;
    findOneById(id: string): Promise<import("./entities/article.entity").Article>;
    findOneBySlug(slug: string): Promise<import("./entities/article.entity").Article>;
    create(dto: CreateArticleDto, authorId: string): Promise<import("./entities/article.entity").Article>;
    update(id: string, dto: UpdateArticleDto): Promise<import("./entities/article.entity").Article>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    uploadImage(file: Express.Multer.File): Promise<{
        success: number;
        file: {
            url: string | undefined;
        };
    }>;
}
