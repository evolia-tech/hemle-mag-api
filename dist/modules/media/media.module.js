"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MediaModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const media_entity_1 = require("./entities/media.entity");
const media_service_1 = require("./media.service");
const media_tokens_1 = require("./constants/media.tokens");
const image_processor_service_1 = require("./processors/image-processor.service");
const video_processor_service_1 = require("./processors/video-processor.service");
const media_controller_1 = require("./media.controller");
let MediaModule = MediaModule_1 = class MediaModule {
    static forRoot(options) {
        return {
            module: MediaModule_1,
            imports: [typeorm_1.TypeOrmModule.forFeature([media_entity_1.Media])],
            controllers: [media_controller_1.MediaController],
            providers: [
                {
                    provide: media_tokens_1.MEDIA_OPTIONS,
                    useValue: options,
                },
                image_processor_service_1.ImageProcessorService,
                video_processor_service_1.VideoProcessorService,
                media_service_1.MediaService,
            ],
            exports: [media_service_1.MediaService],
        };
    }
    static registerMedia() {
        const { GcsStorageProvider } = require('./storage/gcs.storage');
        return MediaModule_1.forRoot({
            storageProvider: new GcsStorageProvider({
                projectId: process.env.GCP_PROJECT_ID,
                publicBucket: process.env.GCP_PUBLIC_BUCKET,
                privateBucket: process.env.GCP_PRIVATE_BUCKET,
                keyFile: process.env.GCP_KEY_FILE,
            }),
            image: {
                maxWidth: 1600,
                maxHeight: 1600,
                quality: 85,
            },
            video: {
                maxWidth: 1280,
                crf: 23,
            },
        });
    }
};
exports.MediaModule = MediaModule;
exports.MediaModule = MediaModule = MediaModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], MediaModule);
//# sourceMappingURL=media.module.js.map