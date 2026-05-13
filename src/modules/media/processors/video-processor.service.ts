import { Injectable } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import { tmpdir } from 'os';
import { join } from 'path';
import { writeFileSync, readFileSync, unlinkSync } from 'fs';

/**
 * Service de traitement des vidéos.
 * 
 * Convertit toutes les vidéos en MP4 (H.264) pour une compatibilité maximale.
 * Utilise FFmpeg pour la compression.
 */
@Injectable()
export class VideoProcessorService {
  async process(
    buffer: Buffer,
    config?: {
      maxWidth?: number;
      crf?: number;
    },
  ) {
    const {
      maxWidth = 1280,
      crf = 23, // 23 = bon équilibre qualité/taille
    } = config || {};

    // Fichiers temporaires
    const inputPath = join(tmpdir(), `input-${Date.now()}`);
    const outputPath = join(tmpdir(), `output-${Date.now()}.mp4`);

    try {
      // Écriture du fichier temporaire
      writeFileSync(inputPath, buffer);

      // Conversion FFmpeg
      await new Promise<void>((resolve, reject) => {
        ffmpeg(inputPath)
          .setFfmpegPath(ffmpegPath!)
          .videoCodec('libx264')
          .outputOptions([
            `-crf ${crf}`,
            '-preset medium', // Vitesse/qualité
            `-vf scale='min(${maxWidth},iw)':-2`, // Garde ratio, max width
            '-movflags +faststart', // Streaming optimization
          ])
          .format('mp4')
          .save(outputPath)
          .on('end', resolve)
          .on('error', reject);
      });

      const outputBuffer = readFileSync(outputPath);

      return {
        buffer: outputBuffer,
        mimeType: 'video/mp4',
        format: 'mp4',
      };
    } finally {
      // Nettoyage des fichiers temporaires
      try {
        unlinkSync(inputPath);
        unlinkSync(outputPath);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }
}