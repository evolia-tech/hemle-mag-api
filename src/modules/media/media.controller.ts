import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import type { Express } from 'express';

/**
 * Controller minimal pour Media.
 * 
 * IMPORTANT : Ce controller ne contient PAS de guards ni d'authentification.
 * C'est le projet hôte qui doit protéger ces routes selon sa logique métier.
 */
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) { }


  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: {
      entityType: string;
      entityId: string;
      ownerId: string;
      isPrimary?: boolean;
      isPrivate?: boolean;
      sortOrder?: number; 
    },
  ) {
    if (!file) throw new BadRequestException('Fichier requis');
    if (!body.entityType || !body.entityId || !body.ownerId) {
      throw new BadRequestException('entityType, entityId et ownerId requis');
    }

    return this.mediaService.upload(
      file,
      body.entityType,
      body.entityId,
      body.ownerId,
      {
        isPrimary: body.isPrimary,
        isPrivate: body.isPrivate,
        sortOrder: body.sortOrder,
      },
    );
  }

  @Delete(':id')
  async hardDelete(@Param('id') id: string) {
    await this.mediaService.hardDelete(id);
    return { success: true };
  }
}