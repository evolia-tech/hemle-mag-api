import { MediaService } from './media.service';
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    upload(file: Express.Multer.File, body: {
        entityType: string;
        entityId: string;
        isPrimary?: boolean;
        isPrivate?: boolean;
        sortOrder?: number;
    }): Promise<import("./entities/media.entity").Media>;
    hardDelete(id: string): Promise<{
        success: boolean;
    }>;
}
