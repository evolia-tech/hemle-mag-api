import { Controller, Get, Param } from "@nestjs/common";
import { MagazinesService } from "../magazines.service";

@Controller('magazines')
export class PublicMagazinesController {
  constructor(private readonly magazinesService: MagazinesService) {}

  @Get()
  findAllPublished() {
    return this.magazinesService.findAllPublished();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.magazinesService.findBySlug(slug);
  }
}