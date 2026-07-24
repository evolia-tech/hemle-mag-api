import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { StaffsService } from 'src/modules/staffs/staffs.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly staffsService: StaffsService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    // findByEmail charge explicitement le password via QueryBuilder
    const staff = await this.staffsService.findByEmail(dto.email);

    if (!staff) {
      // Message générique pour éviter l'énumération des comptes
      throw new UnauthorizedException('Email ou mot de passe invalide.');
    }

    if (!staff.isActive) {
      throw new UnauthorizedException('Compte désactivé. Contactez un administrateur.');
    }

    const isPasswordValid = await staff.comparePassword(dto.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe invalide.');
    }

    const payload: JwtPayload = {
      sub: staff.id,
      email: staff.email,
      roles: staff.roles, // tableau de rôles RBAC
      firstName: staff.firstName,
      lastName: staff.lastName,
    };

    // On retourne le staff sans le password
    const { password: _pwd, ...safeStaff } = staff;

    return {
      accessToken: this.jwtService.sign(payload),
      staff: safeStaff,
    };
  }

  async me(staffId: string) {
    return this.staffsService.findById(staffId);
  }
}