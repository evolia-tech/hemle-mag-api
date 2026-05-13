import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Magazine } from './entities/magazine.entity';
import { MediaService } from '../media/media.service';
import { Express } from 'express';
import { CreateMagazineDto } from './dto/create-magazine.dto';
import { UpdateMagazineDto } from './dto/update-magazine.dto';

@Injectable()
export class MagazinesService {

  constructor(
    @InjectRepository(Magazine)
    private readonly magazineRepository: Repository<Magazine>,

    private readonly mediaService: MediaService,

    private readonly dataSource: DataSource,
  ) {}

  /**
   * Création d’un magazine avec image (transactionnelle)
   *
   * - Création magazine
   * - Upload image
   * - Rollback si erreur
   */
  async create(
    dto: CreateMagazineDto,
    file: Express.Multer.File | undefined,
    userId: string,
  ) {

    return this.dataSource.transaction(async manager => {

      console.log(dto);
      // ✅ Création du magazine
      const magazine = manager.create(Magazine, {
        ...dto,
        createdById: userId,
      });

      const savedMagazine = await manager.save(magazine);

      // ✅ Upload image si présente
      if (file) {
        await this.mediaService.upload(
          file,
          'magazine',
          savedMagazine.id,
          userId,
          {
            isPrimary: true,
            isPrivate: false,
          },
        );
      }

      return savedMagazine;
    });
  }

  /**
   * Mise à jour d’un magazine avec image optionnelle
   */
  async update(
    id: string,
    dto: UpdateMagazineDto,
    file: Express.Multer.File | undefined,
    userId: string,
  ) {

    return this.dataSource.transaction(async manager => {

      const magazine = await manager.findOne(Magazine, {
        where: { id },
      });

      if (!magazine) {
        throw new NotFoundException('Magazine introuvable');
      }

      console.log(dto)

      // ✅ Mise à jour des champs
      Object.assign(magazine, {
        ...dto,
        updatedById: userId,
      });

      const updatedMagazine = await manager.save(magazine);

      // ✅ Si nouvelle image → upload et remplacer ancienne
      if (file) {

        // Optionnel : supprimer ancienne cover
        const existingCover = await this.mediaService.findPrimary(
          'magazine',
          id,
        );

        if (existingCover) {
          await this.mediaService.hardDelete(existingCover.id);
        }

        await this.mediaService.upload(
          file,
          'magazine',
          id,
          userId,
          {
            isPrimary: true,
            isPrivate: false,
          },
        );
      }

      return updatedMagazine;
    });
  }

  /**
   * Liste complète admin
   */
  async findAll() {
    return this.magazineRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findAllWithCover() {

  const magazines = await this.magazineRepository.find({
    order: { createdAt: 'DESC' },
  });

  const result: (Magazine & { coverImage: string | null })[] = [];

  for (const magazine of magazines) {

    const cover = await this.mediaService.findPrimary(
      'magazine',
      magazine.id,
    );

    let coverUrl : string | null = null;

    if (cover) {
      const access = await this.mediaService.getAccessUrl(cover.id);
      coverUrl = access.url;
    }

    result.push({
      ...magazine,
      coverImage: coverUrl,
    });
  }

  return result;
}

  /**
   * Liste publique
   */
  async findAllPublished() {
    return this.magazineRepository.find({
      where: { isPublished: true },
      order: { releaseDate: 'DESC' },
    });
  }

  /**
   * Recherche par slug
   */
  async findBySlug(slug: string) {

    const magazine = await this.magazineRepository.findOne({
      where: {
        slug,
        isPublished: true,
      },
    });

    if (!magazine) {
      throw new NotFoundException('Magazine introuvable');
    }

    return magazine;
  }

  /**
   * Suppression soft
   */
  async remove(id: string) {

    const result = await this.magazineRepository.softDelete(id);

    if (!result.affected) {
      throw new NotFoundException('Magazine introuvable');
    }
  }
}