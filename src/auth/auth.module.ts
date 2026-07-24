import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { StaffsModule } from '../modules/staffs/staffs.module';
import { Staff } from '../modules/staffs/entities/staff.entity';
import { StringValue } from 'ms';

@Module({
  imports: [
    StaffsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // Injection du repo Staff directement pour la stratégie JWT
    TypeOrmModule.forFeature([Staff]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('jwt.secret');
        const expiresIn = configService.get<string>('jwt.expiresIn');

        if (!secret) {
          throw new Error('JWT secret is not defined in configuration.');
        }

        return {
          secret,
          signOptions: {
            expiresIn: (expiresIn ?? '24h') as StringValue,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}