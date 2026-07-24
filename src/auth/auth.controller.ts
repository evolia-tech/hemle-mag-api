import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentStaff } from 'src/common/decorators/current-staff.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/modules/staffs/enums/role.enum';
import { CreateStaffDto } from 'src/modules/staffs/dto/create-staff.dto';
import { StaffsService } from 'src/modules/staffs/staffs.service';

@Controller('auth')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }),
)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly staffsService: StaffsService,
  ) {}

  /**
   * Connexion : retourne un JWT + le profil du staff.
   * Route publique (pas de guard JWT).
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * Profil du staff connecté.
   * Nécessite un JWT valide.
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentStaff('id') staffId: string) {
    return this.authService.me(staffId);
  }

  /**
   * Création d'un compte staff par un admin.
   * Réservé aux ADMIN et SUPER_ADMIN.
   * Route dédiée pour éviter que l'endpoint /staffs (CRUD complet) soit exposé inutilement.
   */
  @Post('create-account')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  createAccount(
    @Body() dto: CreateStaffDto,
    @CurrentStaff('id') createdById: string,
  ) {
    return this.staffsService.create(dto, createdById);
  }
}