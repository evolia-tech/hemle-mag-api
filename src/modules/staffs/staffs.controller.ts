import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { StaffsService } from './staffs.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto, ChangePasswordDto } from './dto/update-staff.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { CurrentStaff } from 'src/common/decorators/current-staff.decorator';
import { Staff } from './entities/staff.entity';

@Controller('staffs')
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }),
)
export class StaffsController {
  constructor(private readonly staffsService: StaffsService) {}

  /**
   * Création d'un compte staff.
   * Réservé aux ADMIN et SUPER_ADMIN.
   */
  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseInterceptors(FileInterceptor('avatar'))
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createStaffDto: CreateStaffDto,
    @CurrentStaff('id') createdById: string,
    @UploadedFile() avatarFile?: Express.Multer.File,
  ) {
    return this.staffsService.create(createStaffDto, createdById, avatarFile);
  }

  /**
   * Liste tous les membres staff.
   * Réservé aux ADMIN et SUPER_ADMIN.
   */
  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  findAll() {
    return this.staffsService.findAll();
  }

  /**
   * Récupère le profil du staff connecté.
   */
  @Get('me')
  getMe(@CurrentStaff() staff: Staff) {
    return staff;
  }

  /**
   * Récupère un membre staff par son ID.
   * Réservé aux ADMIN et SUPER_ADMIN.
   */
  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.staffsService.findById(id);
  }

  /**
   * Mise à jour d'un membre staff.
   * SUPER_ADMIN : peut modifier n'importe qui.
   * ADMIN : peut modifier les EDITOR mais pas les autres ADMIN.
   * EDITOR : peut modifier son propre profil (hors rôles et isActive).
   */
  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.EDITOR)
  @UseInterceptors(FileInterceptor('avatar'))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStaffDto: UpdateStaffDto,
    @CurrentStaff('id') updatedById: string,
    @UploadedFile() avatarFile?: Express.Multer.File,
  ) {
    return this.staffsService.update(id, updateStaffDto, updatedById, avatarFile);
  }

  /**
   * Changement de mot de passe.
   * Le staff peut changer son propre mot de passe (avec vérification de l'ancien).
   * Un ADMIN/SUPER_ADMIN peut réinitialiser le mot de passe de n'importe qui.
   */
  @Patch(':id/change-password')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.EDITOR)
  changePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangePasswordDto,
    @CurrentStaff('id') requesterId: string,
    @CurrentStaff('roles') requesterRoles: Role[],
  ) {
    return this.staffsService.changePassword(id, dto, requesterId, requesterRoles);
  }

  /**
   * Active ou désactive un compte staff.
   * Réservé aux ADMIN et SUPER_ADMIN.
   */
  @Patch(':id/toggle-active')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  toggleActive(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentStaff('id') updatedById: string,
  ) {
    return this.staffsService.toggleActive(id, updatedById);
  }

  /**
   * Suppression douce (soft delete) d'un membre.
   * Réservé au SUPER_ADMIN uniquement.
   */
  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.staffsService.remove(id);
  }
}