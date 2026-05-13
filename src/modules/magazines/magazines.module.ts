// src/magazines/magazines.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Magazine } from './entities/magazine.entity';
import { MagazinesService } from './magazines.service';
import { PublicMagazinesController } from './controllers/public-magazine.controller';
import { AdminMagazinesController } from './controllers/admin-magazine.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Magazine]),
    ],
  controllers: [
    PublicMagazinesController,
    AdminMagazinesController,
  ],
  providers: [MagazinesService],
  exports: [MagazinesService], // Exporté pour le PaymentsModule plus tard
})
export class MagazinesModule { }