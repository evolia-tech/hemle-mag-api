import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from 'src/modules/staffs/entities/staff.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Staff)
    private readonly staffRepo: Repository<Staff>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret')!,
    });
  }

  /**
   * Appelé automatiquement par Passport après vérification de la signature JWT.
   * La valeur retournée est injectée dans request.user.
   */
  async validate(payload: JwtPayload): Promise<Omit<Staff, 'password'>> {
    // Rechargement depuis la BDD pour s'assurer que le compte est toujours actif
    const staff = await this.staffRepo.findOne({
      where: { id: payload.sub },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'roles',
        'isActive',
        'slug',
        'bio',
        'avatarUrl',
        'jobTitle',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!staff) {
      throw new UnauthorizedException('Compte introuvable.');
    }

    if (!staff.isActive) {
      throw new UnauthorizedException('Compte désactivé.');
    }

    return staff;
  }
}