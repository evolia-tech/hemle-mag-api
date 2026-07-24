"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const media_entity_1 = require("./entities/media.entity");
const media_tokens_1 = require("./constants/media.tokens");
const image_processor_service_1 = require("./processors/image-processor.service");
const video_processor_service_1 = require("./processors/video-processor.service");
let MediaService = class MediaService {
    mediaRepository;
    options;
    imageProcessor;
    videoProcessor;
    constructor(mediaRepository, options, imageProcessor, videoProcessor) {
        this.mediaRepository = mediaRepository;
        this.options = options;
        this.imageProcessor = imageProcessor;
        this.videoProcessor = videoProcessor;
    }
    async upload(file, entityType, entityId, uploadOptions) {
        let processedBuffer = file.buffer;
        let finalMimeType = file.mimetype;
        let finalFormat = file.mimetype.split('/')[1];
        if (file.mimetype.startsWith('image/')) {
            const processed = await this.imageProcessor.process(file.buffer, this.options.image);
            processedBuffer = processed.buffer;
            finalMimeType = processed.mimeType;
            finalFormat = processed.format;
        }
        if (file.mimetype.startsWith('video/')) {
            const processed = await this.videoProcessor.process(file.buffer, this.options.video);
            processedBuffer = processed.buffer;
            finalMimeType = processed.mimeType;
            finalFormat = processed.format;
        }
        const destination = `${entityType}/${entityId}/${Date.now()}.${finalFormat}`;
        const uploadResult = await this.options.storageProvider.upload(processedBuffer, destination, finalMimeType, uploadOptions?.isPrivate ?? false);
        const media = this.mediaRepository.create({
            filename: file.originalname,
            key: destination,
            publicUrl: uploadOptions?.isPrivate ? undefined : uploadResult.publicUrl,
            mimeType: finalMimeType,
            size: processedBuffer.length,
            entityType,
            entityId,
            isPrimary: uploadOptions?.isPrimary ?? false,
            isPrivate: uploadOptions?.isPrivate ?? false,
            sortOrder: uploadOptions?.sortOrder ?? 0,
        });
        return this.mediaRepository.save(media);
    }
    async findByEntity(entityType, entityId) {
        return this.mediaRepository.find({
            where: { entityType, entityId },
            order: { sortOrder: 'ASC' },
        });
    }
    async findPrimary(entityType, entityId) {
        return this.mediaRepository.findOne({
            where: { entityType, entityId, isPrimary: true },
        });
    }
    async hardDelete(mediaId) {
        const media = await this.mediaRepository.findOne({
            where: { id: mediaId },
        });
        if (!media)
            throw new common_1.NotFoundException('Media not found');
        await this.options.storageProvider.delete(media.key);
        await this.mediaRepository.remove(media);
    }
    async softDelete(mediaId) {
        await this.mediaRepository.softDelete(mediaId);
    }
    async getAccessUrl(mediaId, expiresInSeconds = 900) {
        const media = await this.mediaRepository.findOne({
            where: { id: mediaId },
        });
        if (!media) {
            throw new common_1.NotFoundException('Media not found');
        }
        if (!media.isPrivate && media.publicUrl) {
            return {
                url: media.publicUrl,
            };
        }
        const signedUrl = await this.options.storageProvider.generateSignedUrl(media.key, expiresInSeconds);
        return {
            url: signedUrl,
        };
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(media_entity_1.Media)),
    __param(1, (0, common_1.Inject)(media_tokens_1.MEDIA_OPTIONS)),
    __metadata("design:paramtypes", [typeorm_1.Repository, Object, image_processor_service_1.ImageProcessorService,
        video_processor_service_1.VideoProcessorService])
], MediaService);
//# sourceMappingURL=media.service.js.map