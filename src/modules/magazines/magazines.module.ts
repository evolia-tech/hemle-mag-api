// src/magazines/magazines.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Magazine } from './entities/magazine.entity';
import { MagazinesService } from './magazines.service';
import { PublicMagazinesController } from './controllers/public-magazine.controller';
import { AdminMagazinesController } from './controllers/admin-magazine.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Media } from '../media/entities/media.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
              imports: [ConfigModule],
              inject: [ConfigService],
              useFactory: (config: ConfigService) => ({
                secret: config.get('jwt.secret'),
                signOptions: {
                  expiresIn: config.get('jwt.expiresIn'),
                },
              }),
            }),
    TypeOrmModule.forFeature([Magazine, Media]),
    ],
  controllers: [
    PublicMagazinesController,
    AdminMagazinesController,
  ],
  providers: [MagazinesService],
  exports: [MagazinesService], // Exporté pour le PaymentsModule plus tard
})
export class MagazinesModule { }