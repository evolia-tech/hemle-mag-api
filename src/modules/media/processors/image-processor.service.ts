import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

/**
 * Service de traitement des images.
 * 
 * Responsabilités :
 * - Conversion automatique en WebP
 * - Redimensionnement intelligent
 * - Optimisation de la qualité
 * 
 * Pourquoi WebP ?
 * - 30% plus léger que JPEG
 * - Qualité équivalente
 * - Support universel moderne
 */
@Injectable()
export class ImageProcessorService {
  async process(
    buffer: Buffer,
    config?: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
    },
  ) {
    const {
      maxWidth = 1600,
      maxHeight = 1600,
      quality = 85,
    } = config || {};

    const processedBuffer = await sharp(buffer)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true, // Ne pas agrandir les petites images
      })
      .webp({ quality })
      .toBuffer();

    return {
      buffer: processedBuffer,
      mimeType: 'image/webp',
      format: 'webp',
    };
  }
}