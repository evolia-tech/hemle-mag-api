// src/modules/magazines/magazines.controller.ts

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/modules/users/enums/role.enum';
import { MagazinesService } from '../magazines.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateMediaDto } from 'src/modules/media/dto/create-media.dto';
import { CreateMagazineDto } from '../dto/create-magazine.dto';
import { UpdateMagazineDto } from '../dto/update-magazine.dto';

@Controller('admin/magazines')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminMagazinesController {
  constructor(private readonly magazinesService: MagazinesService) { }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  @Get()
  findAll() {
    return this.magazinesService.findAllWithCover();
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateMagazineDto,
    @CurrentUser('id') userId: string,
  ) {

    return this.magazinesService.create(body, file, userId);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateMagazineDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.magazinesService.update(id, body, file, userId);
  }

  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.magazinesService.remove(id);
  }
}