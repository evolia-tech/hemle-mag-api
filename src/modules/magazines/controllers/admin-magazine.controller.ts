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
  UploadedFiles,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/modules/staffs/enums/role.enum';
import { MagazinesService } from '../magazines.service';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { CurrentStaff } from 'src/common/decorators/current-staff.decorator';

@Controller('admin/magazines')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminMagazinesController {
  constructor(private readonly magazinesService: MagazinesService) { }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  @Get()
  findAll() {
    return this.magazinesService.findAllWithMedia();
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.magazinesService.findOneWithMedia(id);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'coverImage', maxCount: 1 },      // cover image
    { name: 'pdfFile', maxCount: 1 },   // pdf
  ]))
  create(
    @UploadedFiles() files: {
      coverImage?: Express.Multer.File[];
      pdfFile?: Express.Multer.File[];
    },
    @Body() body: any,
  ) {

    const cover = files.coverImage?.[0];
    const pdf = files.pdfFile?.[0];

    return this.magazinesService.create(body, cover, pdf);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('coverImage'))
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    console.log("here");
    return this.magazinesService.update(id, body, file);
  }

  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.magazinesService.remove(id);
  }
}
