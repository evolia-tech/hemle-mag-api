import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { MediaService } from './media.service';
import { MEDIA_OPTIONS } from './constants/media.tokens';
import { MediaModuleOptions } from './interfaces/media-module-options.interface';
import { ImageProcessorService } from './processors/image-processor.service';
import { VideoProcessorService } from './processors/video-processor.service';
import { MediaController } from './media.controller';

/**
 * MediaModule - Module de gestion de médias générique.
 * 
 * Caractéristiques :
 * - Cloud-agnostic (GCP, AWS, Local)
 * - Compression automatique (WebP, MP4)
 * - Polymorphique (lié à n'importe quelle entité)
 * - Configurable via forRoot()
 */
@Global()
@Module({})
export class MediaModule {
  /**
   * Configuration générique (pour réutilisation dans d'autres projets).
   */
  static forRoot(options: MediaModuleOptions): DynamicModule {
    return {
      module: MediaModule,
      imports: [TypeOrmModule.forFeature([Media])],
      controllers: [MediaController],
      providers: [
        {
          provide: MEDIA_OPTIONS,
          useValue: options,
        },
        ImageProcessorService,
        VideoProcessorService,
        MediaService,
      ],
      exports: [MediaService],
    };
  }

  /**
   * Configuration spécifique au projet HEMLE.
   * Utilisez cette méthode dans AppModule pour garder le code propre.
   */
  static registerMedia(): DynamicModule {
    // Import dynamique pour éviter les erreurs si le fichier n'existe pas encore
    const { GcsStorageProvider } = require('./storage/gcs.storage');

    return MediaModule.forRoot({
      storageProvider: new GcsStorageProvider({
        projectId: process.env.GCP_PROJECT_ID!,
        publicBucket: process.env.GCP_PUBLIC_BUCKET!,
        privateBucket: process.env.GCP_PRIVATE_BUCKET!,
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
}