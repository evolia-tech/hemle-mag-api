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
exports.MagazinesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const magazine_entity_1 = require("./entities/magazine.entity");
const media_service_1 = require("../media/media.service");
const media_entity_1 = require("../media/entities/media.entity");
const jwt_1 = require("@nestjs/jwt");
let MagazinesService = class MagazinesService {
    magazineRepository;
    jwtService;
    mediaService;
    dataSource;
    mediaRepository;
    constructor(magazineRepository, jwtService, mediaService, dataSource, mediaRepository) {
        this.magazineRepository = magazineRepository;
        this.jwtService = jwtService;
        this.mediaService = mediaService;
        this.dataSource = dataSource;
        this.mediaRepository = mediaRepository;
    }
    async create(dto, coverFile, pdfFile) {
        return this.dataSource.transaction(async (manager) => {
            const magazine = manager.create(magazine_entity_1.Magazine, { ...dto });
            const savedMagazine = await manager.save(magazine);
            if (coverFile) {
                await this.mediaService.upload(coverFile, 'magazine', savedMagazine.id, {
                    isPrimary: true,
                    isPrivate: false,
                });
            }
            if (pdfFile) {
                await this.mediaService.upload(pdfFile, 'magazine', savedMagazine.id, {
                    isPrimary: false,
                    isPrivate: true,
                });
            }
            return savedMagazine;
        });
    }
    async update(id, dto, file) {
        return this.dataSource.transaction(async (manager) => {
            const magazine = await manager.findOne(magazine_entity_1.Magazine, {
                where: { id },
            });
            if (!magazine) {
                throw new common_1.NotFoundException('Magazine introuvable');
            }
            Object.assign(magazine, { ...dto });
            const updatedMagazine = await manager.save(magazine);
            if (file) {
                const existingCover = await this.mediaService.findPrimary('magazine', id);
                if (existingCover) {
                    await this.mediaService.hardDelete(existingCover.id);
                }
                await this.mediaService.upload(file, 'magazine', id, {
                    isPrimary: true,
                    isPrivate: false,
                });
            }
            return updatedMagazine;
        });
    }
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
        return magazines;
    }
    async findByIdForPayment(id) {
        const magazine = await this.magazineRepository.findOne({
            where: { id, isPublished: true },
        });
        if (!magazine) {
            throw new common_1.NotFoundException(`Magazine introuvable ou non disponible à la vente.`);
        }
        const cover = await this.mediaService.findPrimary('magazine', magazine.id);
        let coverUrl = null;
        if (cover) {
            const access = await this.mediaService.getAccessUrl(cover.id);
            coverUrl = access.url;
        }
        return {
            id: magazine.id,
            title: magazine.title,
            price: magazine.price,
            coverImage: coverUrl,
            currency: 'eur'
        };
    }
    async findOneWithMedia(id) {
        const magazine = await this.magazineRepository.findOne({
            where: { id },
        });
        if (!magazine) {
            throw new common_1.NotFoundException('Magazine introuvable');
        }
        const medias = await this.mediaService.findByEntity('magazine', id);
        let coverImage = null;
        let pdfFile = null;
        for (const media of medias) {
            if (media.isPrimary && !media.isPrivate) {
                const access = await this.mediaService.getAccessUrl(media.id);
                coverImage = access.url;
            }
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
    async findAllPublishedWithMedia() {
        const magazines = await this.magazineRepository.find({
            where: { isPublished: true },
            order: { releaseDate: 'DESC' },
        });
        const result = [];
        for (const magazine of magazines) {
            const cover = await this.mediaService.findPrimary('magazine', magazine.id);
            let coverUrl = null;
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
    async findBySlug(slug) {
        const magazine = await this.magazineRepository.findOne({
            where: {
                slug,
                isPublished: true,
            },
        });
        if (!magazine) {
            throw new common_1.NotFoundException('Magazine introuvable');
        }
        const medias = await this.mediaService.findByEntity('magazine', magazine.id);
        let coverImage = null;
        for (const media of medias) {
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
    async findLatestPublished() {
        const latestMagazine = await this.magazineRepository.findOne({
            where: { isPublished: true },
            order: { releaseDate: 'DESC' },
        });
        if (!latestMagazine) {
            throw new common_1.NotFoundException('Aucun magazine publié trouvé');
        }
        const cover = await this.mediaService.findPrimary('magazine', latestMagazine.id);
        let coverUrl = null;
        if (cover) {
            const access = await this.mediaService.getAccessUrl(cover.id);
            coverUrl = access.url;
        }
        return {
            ...latestMagazine,
            coverImage: coverUrl,
        };
    }
    async remove(id) {
        const result = await this.magazineRepository.softDelete(id);
        if (!result.affected) {
            throw new common_1.NotFoundException('Magazine introuvable');
        }
    }
    async findByIds(ids) {
        if (!ids || ids.length === 0) {
            return [];
        }
        const magazines = await this.magazineRepository.find({
            where: {
                id: (0, typeorm_2.In)(ids),
            },
        });
        return magazines;
    }
    async downloadWithToken(token) {
        let payload;
        try {
            payload = this.jwtService.verify(token);
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
        const magazineItem = payload.items.find((item) => item.type === 'magazine');
        if (!magazineItem) {
            throw new common_1.UnauthorizedException('Invalid download scope');
        }
        const pdfMedia = await this.mediaRepository.findOne({
            where: {
                entityType: 'magazine',
                entityId: magazineItem.productId,
                isPrivate: true,
            },
        });
        if (!pdfMedia) {
            throw new common_1.NotFoundException('PDF not found');
        }
        const signedUrl = await this.mediaService.getAccessUrl(pdfMedia.publicUrl);
        return { url: signedUrl };
    }
    generateDownloadToken(magazineId) {
        return this.jwtService.sign({
            items: [
                {
                    type: 'magazine',
                    productId: magazineId,
                },
            ],
        }, { expiresIn: '72h' });
    }
};
exports.MagazinesService = MagazinesService;
exports.MagazinesService = MagazinesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(magazine_entity_1.Magazine)),
    __param(4, (0, typeorm_1.InjectRepository)(media_entity_1.Media)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        media_service_1.MediaService,
        typeorm_2.DataSource,
        typeorm_2.Repository])
], MagazinesService);
//# sourceMappingURL=magazines.service.js.map