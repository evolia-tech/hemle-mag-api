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
exports.StaffsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const staff_entity_1 = require("./entities/staff.entity");
const role_enum_1 = require("./enums/role.enum");
const media_service_1 = require("../media/media.service");
let StaffsService = class StaffsService {
    staffRepo;
    mediaService;
    constructor(staffRepo, mediaService) {
        this.staffRepo = staffRepo;
        this.mediaService = mediaService;
    }
    safeSelect = [
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
    async resolveAvatarUrl(staff) {
        if (!staff)
            return staff;
        const media = await this.mediaService.findPrimary('staff', staff.id);
        if (media) {
            const access = await this.mediaService.getAccessUrl(media.id);
            staff.avatarUrl = access.url;
        }
        return staff;
    }
    async create(dto, createdById, avatarFile) {
        const exists = await this.staffRepo.findOne({
            where: { email: dto.email },
        });
        if (exists) {
            throw new common_1.ConflictException('Un utilisateur avec cet email existe déjà.');
        }
        const slug = await this.generateUniqueSlug(dto.firstName, dto.lastName, dto.roles ?? [role_enum_1.Role.EDITOR]);
        const staff = this.staffRepo.create({
            ...dto,
            roles: dto.roles ?? [role_enum_1.Role.EDITOR],
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
    async findAll() {
        const staffs = await this.staffRepo.find({
            select: this.safeSelect,
            order: { createdAt: 'DESC' },
        });
        return Promise.all(staffs.map((s) => this.resolveAvatarUrl(s)));
    }
    async findById(id) {
        const staff = await this.staffRepo.findOne({
            where: { id },
            select: this.safeSelect,
        });
        if (!staff) {
            throw new common_1.NotFoundException('Membre staff introuvable.');
        }
        return this.resolveAvatarUrl(staff);
    }
    async findEntityByIdWithPassword(id) {
        const staff = await this.staffRepo
            .createQueryBuilder('staff')
            .addSelect('staff.password')
            .where('staff.id = :id', { id })
            .getOne();
        if (!staff) {
            throw new common_1.NotFoundException('Membre staff introuvable.');
        }
        return staff;
    }
    async findByEmail(email) {
        return this.staffRepo
            .createQueryBuilder('staff')
            .addSelect('staff.password')
            .where('staff.email = :email', { email })
            .getOne();
    }
    async update(id, dto, updatedById, avatarFile) {
        const staff = await this.staffRepo.findOne({ where: { id } });
        if (!staff) {
            throw new common_1.NotFoundException('Membre staff introuvable.');
        }
        const nameChanged = (dto.firstName !== undefined && dto.firstName !== staff.firstName) ||
            (dto.lastName !== undefined && dto.lastName !== staff.lastName);
        const rolesChanged = dto.roles !== undefined && JSON.stringify(dto.roles) !== JSON.stringify(staff.roles);
        let slug = staff.slug;
        if (nameChanged || rolesChanged || !slug) {
            slug = await this.generateUniqueSlug(dto.firstName ?? staff.firstName, dto.lastName ?? staff.lastName, dto.roles ?? staff.roles, id);
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
    async changePassword(id, dto, requesterId, requesterRoles) {
        const staff = await this.findEntityByIdWithPassword(id);
        const isSelf = requesterId === id;
        const isAdmin = requesterRoles.includes(role_enum_1.Role.ADMIN) || requesterRoles.includes(role_enum_1.Role.SUPER_ADMIN);
        if (!isSelf && !isAdmin) {
            throw new common_1.ForbiddenException('Vous ne pouvez changer que votre propre mot de passe.');
        }
        if (isSelf && !isAdmin) {
            if (!dto.currentPassword) {
                throw new common_1.UnauthorizedException('Le mot de passe actuel est requis pour changer votre mot de passe.');
            }
            const valid = await staff.comparePassword(dto.currentPassword);
            if (!valid) {
                throw new common_1.UnauthorizedException('Mot de passe actuel incorrect.');
            }
        }
        staff.password = dto.newPassword;
        await this.staffRepo.save(staff);
        return { message: 'Mot de passe mis à jour avec succès.' };
    }
    async toggleActive(id, updatedById) {
        const staff = await this.staffRepo.findOne({ where: { id } });
        if (!staff) {
            throw new common_1.NotFoundException('Membre staff introuvable.');
        }
        staff.isActive = !staff.isActive;
        staff.updatedById = updatedById;
        await this.staffRepo.save(staff);
        return this.findById(id);
    }
    async remove(id) {
        const result = await this.staffRepo.softDelete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Membre staff introuvable.');
        }
    }
    async generateUniqueSlug(firstName, lastName, roles, excludeStaffId) {
        const highestRole = roles.includes(role_enum_1.Role.SUPER_ADMIN)
            ? 'super-admin'
            : roles.includes(role_enum_1.Role.ADMIN)
                ? 'admin'
                : 'editor';
        const baseSlug = `${firstName}-${lastName}-${highestRole}`
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
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
};
exports.StaffsService = StaffsService;
exports.StaffsService = StaffsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(staff_entity_1.Staff)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        media_service_1.MediaService])
], StaffsService);
//# sourceMappingURL=staffs.service.js.map