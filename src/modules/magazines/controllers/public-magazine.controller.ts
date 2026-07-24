import { BadRequestException, Controller, Get, Param, Query } from "@nestjs/common";
import { MagazinesService } from "../magazines.service";

@Controller('magazines')
export class PublicMagazinesController {
  constructor(private readonly magazinesService: MagazinesService) {}

  @Get()
  findAllPublished() {
    return this.magazinesService.findAllPublishedWithMedia();
  }

  @Get('latest')
  findLatest() {
    return this.magazinesService.findLatestPublished();
  }
  
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.magazinesService.findBySlug(slug);
  }

  @Get('download')
  async downloadWithToken(
    @Query('token') token: string,
  ) {
    if (!token) {
      throw new BadRequestException('Missing token');
    }

    return this.magazinesService.downloadWithToken(token);
  }

}