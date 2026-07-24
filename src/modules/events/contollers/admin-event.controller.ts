import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { EventsService } from '../events.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/modules/staffs/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UpdateEventDto } from '../dto/update-event.dto';
import { CurrentStaff } from 'src/common/decorators/current-staff.decorator';

@Controller('admin/events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  create(
    @Body() body: any, 
    @UploadedFile() image: Express.Multer.File,
    @CurrentStaff('id') staffId: string,) 
    {
    return this.eventsService.create(body, image, staffId);
  }

@Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(+id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(+id);
  }
}
