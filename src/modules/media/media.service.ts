import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { MEDIA_OPTIONS } from './constants/media.tokens';
import type { MediaModuleOptions } from './interfaces/media-module-options.interface';
import { ImageProcessorService } from './processors/image-processor.service';
import { VideoProcessorService } from './processors/video-processor.service';
import { Express } from 'express';

/**
 * MediaService
 * 
 * Service principal d'orchestration.
 * 
 * Flux d'un upload :
 * 1. Détection du type (image/vidéo/autre)
 * 2. Traitement (compression/conversion)
 * 3. Upload cloud
 * 4. Persistance métadonnées
 */
@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,

    @Inject(MEDIA_OPTIONS)
    private readonly options: MediaModuleOptions,

    private readonly imageProcessor: ImageProcessorService,
    private readonly videoProcessor: VideoProcessorService,
  ) { }

  /**
   * Upload un fichier avec traitement automatique.
   */
  async upload(
    file: Express.Multer.File,
    entityType: string,
    entityId: string,
    ownerId: string,
    uploadOptions?: {
      isPrimary?: boolean;
      isPrivate?: boolean;
      sortOrder?: number;
    },
  ) {
    let processedBuffer = file.buffer;
    let finalMimeType = file.mimetype;
    let finalFormat = file.mimetype.split('/')[1];

    // Traitement image -> WebP
    if (file.mimetype.startsWith('image/')) {
      const processed = await this.imageProcessor.process(
        file.buffer,
        this.options.image,
      );
      processedBuffer = processed.buffer;
      finalMimeType = processed.mimeType;
      finalFormat = processed.format;
    }

    // Traitement vidéo -> MP4
    if (file.mimetype.startsWith('video/')) {
      const processed = await this.videoProcessor.process(
        file.buffer,
        this.options.video,
      );
      processedBuffer = processed.buffer;
      finalMimeType = processed.mimeType;
      finalFormat = processed.format;
    }

    // Construction du chemin : entityType/entityId/timestamp.format
    const destination = `${entityType}/${entityId}/${Date.now()}.${finalFormat}`;

    // Upload vers le cloud
    const uploadResult = await this.options.storageProvider.upload(
      processedBuffer,
      destination,
      finalMimeType,
      uploadOptions?.isPrivate ?? false,
    );

    // Création de l'entité
    const media = this.mediaRepository.create({
      filename: file.originalname,
      key: destination,
      publicUrl: uploadOptions?.isPrivate ? undefined : uploadResult.publicUrl,
      mimeType: finalMimeType,
      size: processedBuffer.length,
      entityType,
      entityId,
      ownerId,
      isPrimary: uploadOptions?.isPrimary ?? false,
      isPrivate: uploadOptions?.isPrivate ?? false,
      sortOrder: uploadOptions?.sortOrder ?? 0,
    });

    return this.mediaRepository.save(media);
  }

  /**
   * Récupère les médias d'une entité (triés par ordre).
   */
  async findByEntity(entityType: string, entityId: string) {
    return this.mediaRepository.find({
      where: { entityType, entityId },
      order: { sortOrder: 'ASC' },
    });
  }

  /**
   * Récupère le média principal d'une entité.
   */
  async findPrimary(entityType: string, entityId: string) {
    return this.mediaRepository.findOne({
      where: { entityType, entityId, isPrimary: true },
    });
  }

  /**
   * Suppression définitive (cloud + base).
   */
  async hardDelete(mediaId: string) {
    const media = await this.mediaRepository.findOne({
      where: { id: mediaId },
    });

    if (!media) throw new NotFoundException('Media not found');

    await this.options.storageProvider.delete(media.key);
    await this.mediaRepository.remove(media);
  }

  /**
   * Suppression logicielle (garde le fichier cloud).
   */
  async softDelete(mediaId: string) {
    await this.mediaRepository.softDelete(mediaId);
  }

  /**
 * Génère l’URL d’accès d’un média.
 *
 * Cas 1️⃣ : Fichier public
 * → Retourne directement publicUrl
 *
 * Cas 2️⃣ : Fichier privé
 * → Génère une URL signée temporaire
 *
 * @param mediaId UUID du média
 * @param expiresInSeconds Durée de validité (par défaut 15 minutes)
 */
  async getAccessUrl(
    mediaId: string,
    expiresInSeconds = 900, // 15 minutes par défaut
  ): Promise<{ url: string }> {

    // ✅ Recherche du média en base
    const media = await this.mediaRepository.findOne({
      where: { id: mediaId },
    });

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    // ✅ Si le fichier est public et a une URL publique
    if (!media.isPrivate && media.publicUrl) {
      return {
        url: media.publicUrl,
      };
    }

    // ✅ Sinon génération d'une URL signée temporaire
    const signedUrl = await this.options.storageProvider.generateSignedUrl(
      media.key,
      expiresInSeconds,
    );

    return {
      url: signedUrl,
    };
  }
}