import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from './entities/staff.entity';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto, ChangePasswordDto } from './dto/update-staff.dto';
import { Role } from './enums/role.enum';

import { MediaService } from '../media/media.service';

@Injectable()
export class StaffsService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepo: Repository<Staff>,
    private readonly mediaService: MediaService,
  ) {}

  // ─── Sécurité interne ─────────────────────────────────────────────────────

  /**
   * Colonnes sûres à retourner (sans le password)
   */
  private readonly safeSelect: (keyof Staff)[] = [
    'id',
    'email',
    'firstName',
    'lastName',
    'roles',
    'isActive',
    'slug',
    'bio',
    'avatarUrl',
    'jobTitle',
    'phoneNumber',
    'createdAt',
    'updatedAt',
    'createdById',
    'updatedById',
  ];

  private async resolveAvatarUrl(staff: Staff): Promise<Staff> {
    if (!staff) return staff;
    const media = await this.mediaService.findPrimary('staff', staff.id);
    if (media) {
      const access = await this.mediaService.getAccessUrl(media.id);
      staff.avatarUrl = access.url;
    }
    return staff;
  }

  // ─── CRUD ─────────────────────────────────────────────────────────────────

  /**
   * Création d'un compte staff.
   * Seul un ADMIN ou SUPER_ADMIN peut créer un compte.
   * La permission est vérifiée au niveau du controller via @Roles.
   */
  async create(
    dto: CreateStaffDto,
    createdById?: string,
    avatarFile?: Express.Multer.File,
  ): Promise<Staff> {
    const exists = await this.staffRepo.findOne({
      where: { email: dto.email },
    });

    if (exists) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà.');
    }

    // Génération automatique et unique du slug à partir des nom, prénom et rôle principal
    const slug = await this.generateUniqueSlug(dto.firstName, dto.lastName, dto.roles ?? [Role.EDITOR]);

    const staff = this.staffRepo.create({
      ...dto,
      roles: dto.roles ?? [Role.EDITOR],
      slug,
      createdById,
    });

    const saved = await this.staffRepo.save(staff);

    if (avatarFile) {
      await this.mediaService.upload(avatarFile, 'staff', saved.id, {
        isPrimary: true,
        isPrivate: false,
      });
    }

    return this.findById(saved.id);
  }

  async findAll(): Promise<Staff[]> {
    const staffs = await this.staffRepo.find({
      select: this.safeSelect,
      order: { createdAt: 'DESC' },
    });
    return Promise.all(staffs.map((s) => this.resolveAvatarUrl(s)));
  }

  async findById(id: string): Promise<Staff> {
    const staff = await this.staffRepo.findOne({
      where: { id },
      select: this.safeSelect,
    });

    if (!staff) {
      throw new NotFoundException('Membre staff introuvable.');
    }

    return this.resolveAvatarUrl(staff);
  }

  /**
   * Utilisé en interne par la stratégie JWT (inclut le password pour comparaison).
   */
  async findEntityByIdWithPassword(id: string): Promise<Staff> {
    const staff = await this.staffRepo
      .createQueryBuilder('staff')
      .addSelect('staff.password')
      .where('staff.id = :id', { id })
      .getOne();

    if (!staff) {
      throw new NotFoundException('Membre staff introuvable.');
    }

    return staff;
  }

  async findByEmail(email: string): Promise<Staff | null> {
    return this.staffRepo
      .createQueryBuilder('staff')
      .addSelect('staff.password') // password en select:false, on le charge explicitement
      .where('staff.email = :email', { email })
      .getOne();
  }

  async update(
    id: string,
    dto: UpdateStaffDto,
    updatedById?: string,
    avatarFile?: Express.Multer.File,
  ): Promise<Staff> {
    const staff = await this.staffRepo.findOne({ where: { id } });

    if (!staff) {
      throw new NotFoundException('Membre staff introuvable.');
    }

    // Regénération automatique et unique du slug si le nom, prénom ou rôles changent
    const nameChanged = (dto.firstName !== undefined && dto.firstName !== staff.firstName) ||
                        (dto.lastName !== undefined && dto.lastName !== staff.lastName);
    const rolesChanged = dto.roles !== undefined && JSON.stringify(dto.roles) !== JSON.stringify(staff.roles);

    let slug = staff.slug;
    if (nameChanged || rolesChanged || !slug) {
      slug = await this.generateUniqueSlug(
        dto.firstName ?? staff.firstName,
        dto.lastName ?? staff.lastName,
        dto.roles ?? staff.roles,
        id
      );
    }

    Object.assign(staff, dto, { slug, updatedById });
    const saved = await this.staffRepo.save(staff);

    if (avatarFile) {
      const existingCover = await this.mediaService.findPrimary('staff', id);
      if (existingCover) {
        await this.mediaService.hardDelete(existingCover.id);
      }

      await this.mediaService.upload(avatarFile, 'staff', id, {
        isPrimary: true,
        isPrivate: false,
      });
    }

    return this.findById(saved.id);
  }

  async changePassword(
    id: string,
    dto: ChangePasswordDto,
    requesterId: string,
    requesterRoles: Role[],
  ): Promise<{ message: string }> {
    const staff = await this.findEntityByIdWithPassword(id);

    const isSelf = requesterId === id;
    const isAdmin = requesterRoles.includes(Role.ADMIN) || requesterRoles.includes(Role.SUPER_ADMIN);

    if (!isSelf && !isAdmin) {
      throw new ForbiddenException(
        'Vous ne pouvez changer que votre propre mot de passe.',
      );
    }

    // Si c'est le staff lui-même qui change son mot de passe, vérifier l'ancien
    if (isSelf && !isAdmin) {
      if (!dto.currentPassword) {
        throw new UnauthorizedException(
          'Le mot de passe actuel est requis pour changer votre mot de passe.',
        );
      }
      const valid = await staff.comparePassword(dto.currentPassword);
      if (!valid) {
        throw new UnauthorizedException('Mot de passe actuel incorrect.');
      }
    }

    staff.password = dto.newPassword;
    await this.staffRepo.save(staff); // @BeforeUpdate → hashPassword() s'exécute

    return { message: 'Mot de passe mis à jour avec succès.' };
  }

  async toggleActive(id: string, updatedById?: string): Promise<Staff> {
    const staff = await this.staffRepo.findOne({ where: { id } });

    if (!staff) {
      throw new NotFoundException('Membre staff introuvable.');
    }

    staff.isActive = !staff.isActive;
    staff.updatedById = updatedById;
    await this.staffRepo.save(staff);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.staffRepo.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Membre staff introuvable.');
    }
  }

  // ─── Utilitaires ──────────────────────────────────────────────────────────

  /**
   * Génère un slug unique URL-friendly à partir du prénom, nom et rôle principal.
   * Si le slug existe déjà en base de données, incrémente un compteur.
   */
  private async generateUniqueSlug(
    firstName: string,
    lastName: string,
    roles: Role[],
    excludeStaffId?: string
  ): Promise<string> {
    const highestRole = roles.includes(Role.SUPER_ADMIN)
      ? 'super-admin'
      : roles.includes(Role.ADMIN)
        ? 'admin'
        : 'editor';

    const baseSlug = `${firstName}-${lastName}-${highestRole}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // supprime les accents
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const query = this.staffRepo.createQueryBuilder('staff')
        .where('staff.slug = :slug', { slug });

      if (excludeStaffId) {
        query.andWhere('staff.id != :id', { id: excludeStaffId });
      }

      const exists = await query.getOne();
      if (!exists) {
        break;
      }
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }
}