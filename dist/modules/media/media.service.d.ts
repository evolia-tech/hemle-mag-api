import { Repository } from 'typeorm';
import { Media } from './entities/media.entity';
import type { MediaModuleOptions } from './interfaces/media-module-options.interface';
import { ImageProcessorService } from './processors/image-processor.service';
import { VideoProcessorService } from './processors/video-processor.service';
export declare class MediaService {
    private readonly mediaRepository;
    private readonly options;
    private readonly imageProcessor;
    private readonly videoProcessor;
    constructor(mediaRepository: Repository<Media>, options: MediaModuleOptions, imageProcessor: ImageProcessorService, videoProcessor: VideoProcessorService);
    upload(file: Express.Multer.File, entityType: string, entityId: string, uploadOptions?: {
        isPrimary?: boolean;
        isPrivate?: boolean;
        sortOrder?: number;
    }): Promise<Media>;
    findByEntity(entityType: string, entityId: string): Promise<Media[]>;
    findPrimary(entityType: string, entityId: string): Promise<Media | null>;
    hardDelete(mediaId: string): Promise<void>;
    softDelete(mediaId: string): Promise<void>;
    getAccessUrl(mediaId: string, expiresInSeconds?: number): Promise<{
        url: string;
    }>;
}
