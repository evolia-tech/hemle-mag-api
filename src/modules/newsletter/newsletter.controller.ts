import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
import { UpdateSubscriberStatusDto } from './dto/update-subscriber-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../staffs/enums/role.enum';

@Controller('newsletter')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }),
)
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  /**
   * Inscription depuis le site public. Route publique (pas de JWT).
   * POST /newsletter/subscribe
   */
  @Post('subscribe')
  @HttpCode(HttpStatus.OK)
  subscribe(@Body() dto: SubscribeNewsletterDto) {
    return this.newsletterService.subscribe(dto);
  }

  /**
   * Désabonnement via token (lien dans l'email). Route publique.
   * GET /newsletter/unsubscribe?token=xxx
   */
  @Get('unsubscribe')
  @HttpCode(HttpStatus.OK)
  unsubscribeByToken(@Query('token') token: string) {
    return this.newsletterService.unsubscribeByToken(token);
  }

  /**
   * Liste de tous les abonnés. Réservé aux admins.
   * GET /newsletter/subscribers
   */
  @Get('subscribers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  getAll() {
    return this.newsletterService.getAll();
  }

  /**
   * Mise à jour du statut d'un abonné. Réservé aux admins.
   * PATCH /newsletter/:id/status
   */
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateSubscriberStatusDto,
  ) {
    return this.newsletterService.updateStatus(id, dto);
  }
}
