import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../staffs/enums/role.enum';
import { CurrentStaff } from '../../common/decorators/current-staff.decorator';
import { MediaService } from '../media/media.service';
import type { Express } from 'express';

@Controller('articles')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
)
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly mediaService: MediaService,
  ) {}

  /**
   * GET /articles
   * Liste publique des articles publiés
   */
  @Get()
  findAllPublic() {
    return this.articlesService.findAllPublic();
  }

  /**
   * GET /articles/admin
   * Liste administrative de tous les articles (protégée)
   */
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.EDITOR)
  findAllAdmin() {
    return this.articlesService.findAllAdmin();
  }

  /**
   * GET /articles/admin/:id
   * Récupérer un article par son ID (pour modification admin)
   */
  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.EDITOR)
  findOneById(@Param('id') id: string) {
    return this.articlesService.findOneById(id);
  }

  /**
   * GET /articles/:slug
   * Détails d'un article par son slug
   */
  @Get(':slug')
  findOneBySlug(@Param('slug') slug: string) {
    return this.articlesService.findOneBySlug(slug);
  }

  /**
   * POST /articles
   * Créer un nouvel article
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.EDITOR)
  create(
    @Body() dto: CreateArticleDto,
    @CurrentStaff('id') authorId: string,
  ) {
    return this.articlesService.create(dto, authorId);
  }

  /**
   * PATCH /articles/:id
   * Modifier un article
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.EDITOR)
  update(@Param('id') id: string, @Body() dto: UpdateArticleDto) {
    return this.articlesService.update(id, dto);
  }

  /**
   * DELETE /articles/:id
   * Supprimer un article
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.EDITOR)
  remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }

  /**
   * POST /articles/upload-image
   * Uploader une image inline au sein de l'éditeur Editor.js
   */
  @Post('upload-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.EDITOR)
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Fichier image requis');
    }

    try {
      const media = await this.mediaService.upload(
        file,
        'article-inline',
        'temp-editor',
        { isPrivate: false },
      );

      return {
        success: 1,
        file: {
          url: media.publicUrl,
        },
      };
    } catch (error) {
      throw new BadRequestException(`Erreur d'upload : ${error.message}`);
    }
  }
}
