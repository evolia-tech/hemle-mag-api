import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Magazine } from './entities/magazine.entity';
import { MediaService } from '../media/media.service';
import { CreateMagazineDto } from './dto/create-magazine.dto';
import { UpdateMagazineDto } from './dto/update-magazine.dto';
import { Media } from '../media/entities/media.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MagazinesService {

  constructor(
    @InjectRepository(Magazine)
    private readonly magazineRepository: Repository<Magazine>,

    private readonly jwtService: JwtService,

    private readonly mediaService: MediaService,

    private readonly dataSource: DataSource,

    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) { }

  /**
   * Création d’un magazine avec image (transactionnelle)
   *
   * - Création magazine
   * - Upload image
   * - Rollback si erreur
   */
  async create(
    dto: CreateMagazineDto,
    coverFile: Express.Multer.File | undefined,
    pdfFile: Express.Multer.File | undefined,
  ) {

    return this.dataSource.transaction(async manager => {

      // ✅ Création du magazine
      const magazine = manager.create(Magazine, { ...dto });

      const savedMagazine = await manager.save(magazine);

      // ✅ Upload image si présente
      if (coverFile) {
        await this.mediaService.upload(
          coverFile,
          'magazine',
          savedMagazine.id,
          {
            isPrimary: true,
            isPrivate: false,
          },
        );
      }

      if (pdfFile) {
        await this.mediaService.upload(
          pdfFile,
          'magazine',
          savedMagazine.id,
          {
            isPrimary: false,
            isPrivate: true,   // 🔒 IMPORTANT
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
    file: Express.Multer.File | undefined
  ) {

    return this.dataSource.transaction(async manager => {

      const magazine = await manager.findOne(Magazine, {
        where: { id },
      });

      if (!magazine) {
        throw new NotFoundException('Magazine introuvable');
      }

      // ✅ Mise à jour des champs
      Object.assign(magazine, { ...dto });

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

  async findAllWithMedia() {

    const magazines = await this.magazineRepository.find({
      select: {
        id: true,
        title: true,
        number: true,
        price: true,
        isPublished: true,
      },
      order: { createdAt: 'DESC' },
    });

    /*
        const result: (Magazine & { coverImage: string | null })[] = [];
    
        for (const magazine of magazines) {
    
          const cover = await this.mediaService.findPrimary(
            'magazine',
            magazine.id,
          );
    
          let coverUrl: string | null = null;
    
          if (cover) {
            const access = await this.mediaService.getAccessUrl(cover.id);
            coverUrl = access.url;
          }
    
          result.push({
            ...magazine,
            coverImage: coverUrl,
          });
        }
    
        */
    return magazines;
  }



  /**
   * Récupère les informations critiques d'un magazine pour le module de paiement.
   * Cette méthode isole la logique métier du module Magazine vis-à-vis du module Billing.
   */
  async findByIdForPayment(id: string): Promise<{ id: string; title: string; price: number; coverImage: string | null; currency: string }> {
    // 1. Récupération du magazine
    const magazine = await this.magazineRepository.findOne({
      where: { id, isPublished: true }, // On n'achète pas un magazine non publié !
    });

    if (!magazine) {
      throw new NotFoundException(`Magazine introuvable ou non disponible à la vente.`);
    }

    // 2. Récupération de l'image de couverture associée
    const cover = await this.mediaService.findPrimary('magazine', magazine.id);

    let coverUrl: string | null = null;

    if (cover) {
      const access = await this.mediaService.getAccessUrl(cover.id);
      coverUrl = access.url;
    }

    // 3. On retourne un objet standardisé et propre pour le PaymentsService
    return {
      id: magazine.id,
      title: magazine.title,
      price: magazine.price,
      coverImage: coverUrl,
      currency: 'eur'
    };
  }



  async findOneWithMedia(id: string) {

    const magazine = await this.magazineRepository.findOne({
      where: { id },
    });

    if (!magazine) {
      throw new NotFoundException('Magazine introuvable');
    }

    // ✅ Récupérer tous les médias liés
    const medias = await this.mediaService.findByEntity('magazine', id);

    let coverImage: string | null = null;
    let pdfFile: string | null = null;

    for (const media of medias) {

      // ✅ Image principale
      if (media.isPrimary && !media.isPrivate) {
        const access = await this.mediaService.getAccessUrl(media.id);
        coverImage = access.url;
      }

      // ✅ PDF privé
      if (media.isPrivate) {
        const access = await this.mediaService.getAccessUrl(media.id);
        pdfFile = access.url;
      }
    }

    return {
      ...magazine,
      coverImage,
      pdfFile,
    };
  }

  /**
   * Liste publique
   */
  async findAllPublishedWithMedia() {

    const magazines = await this.magazineRepository.find({
      where: { isPublished: true },
      order: { releaseDate: 'DESC' },
    });

    const result: (Partial<Magazine> & { coverImage: string | null })[] = [];

    for (const magazine of magazines) {

      const cover = await this.mediaService.findPrimary(
        'magazine',
        magazine.id,
      );

      let coverUrl: string | null = null;

      if (cover) {
        const access = await this.mediaService.getAccessUrl(cover.id);
        coverUrl = access.url;
      }

      result.push({
        id: magazine.id,
        title: magazine.title,
        slug: magazine.slug,
        number: magazine.number,
        summary: magazine.summary,
        price: magazine.price,
        releaseDate: magazine.releaseDate,
        sections: magazine.sections,
        coverImage: coverUrl,
      });
    }

    return result;

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

    // ✅ Récupérer tous les médias liés
    const medias = await this.mediaService.findByEntity('magazine', magazine.id);

    let coverImage: string | null = null;

    for (const media of medias) {
      // ✅ Image principale
      if (media.isPrimary && !media.isPrivate) {
        const access = await this.mediaService.getAccessUrl(media.id);
        coverImage = access.url;
      }
    }

    const { isPublished, createdAt, updatedAt, createdById, updatedById, deletedAt, ...rest } = magazine;

    return {
      ...rest,
      coverImage
    };
  }

  /**
   * Récupère le magazine publié le plus récent
   */
  async findLatestPublished() {
    // 1. On cherche le magazine publié avec la date de sortie la plus récente
    const latestMagazine = await this.magazineRepository.findOne({
      where: { isPublished: true },
      order: { releaseDate: 'DESC' },
    });

    if (!latestMagazine) {
      throw new NotFoundException('Aucun magazine publié trouvé');
    }

    // 2. Récupération de la cover image via le MediaService
    const cover = await this.mediaService.findPrimary(
      'magazine',
      latestMagazine.id,
    );

    let coverUrl: string | null = null;
    if (cover) {
      const access = await this.mediaService.getAccessUrl(cover.id);
      coverUrl = access.url;
    }

    // 3. Retourne l'objet combiné
    return {
      ...latestMagazine,
      coverImage: coverUrl,
    };
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

  /**
   * Trouver plusieurs magazines par leurs IDs
   *
   * Utilisé pour :
   * - Vérifier les magazines avant paiement
   * - Récupérer les VRAIS prix
   * - Vérifier que les magazines existent
   *
   * @param ids - Array d'UUIDs des magazines
   * @returns Array de magazines trouvés
   *
   * Exemple :
   * const magazines = await this.magazinesService.findByIds([
   *   'uuid-123',
   *   'uuid-456'
   * ]);
   */
  async findByIds(ids: string[]): Promise<Magazine[]> {
    // Vérifier que la liste n'est pas vide
    if (!ids || ids.length === 0) {
      return [];
    }

    // Utiliser l'opérateur In() de TypeORM
    // pour faire une requête WHERE id IN (...)
    const magazines = await this.magazineRepository.find({
      where: {
        id: In(ids),
      },
    });

    return magazines;
  }

  async downloadWithToken(token: string) {

    let payload: any;

    try {
      payload = this.jwtService.verify(token);
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const magazineItem = payload.items.find(
      (item: any) => item.type === 'magazine',
    );

    if (!magazineItem) {
      throw new UnauthorizedException('Invalid download scope');
    }

    const pdfMedia = await this.mediaRepository.findOne({
      where: {
        entityType: 'magazine',
        entityId: magazineItem.productId,
        isPrivate: true,
      },
    });

    if (!pdfMedia) {
      throw new NotFoundException('PDF not found');
    }

    const signedUrl = await this.mediaService.getAccessUrl(pdfMedia.publicUrl!);

    return { url: signedUrl };
  }

  generateDownloadToken(magazineId: string): string {
    return this.jwtService.sign(
      {
        items: [
          {
            type: 'magazine',
            productId: magazineId,
          },
        ],
      },
      { expiresIn: '72h' }, // Le lien de téléchargement est valable 72h
    );
  }
}