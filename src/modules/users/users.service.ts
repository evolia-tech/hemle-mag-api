import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  private sanitize(user: User) {
    const { password, ...safeUser } = user;
    return safeUser as User;
  }

  async create(dto: CreateUserDto, createdById?: string): Promise<User> {
    const exists = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (exists) {
      throw new ConflictException(
        'Un utilisateur avec cet email existe déjà.',
      );
    }

    const user = this.userRepo.create({
      ...dto,
      createdById,
    });

    const saved = await this.userRepo.save(user);
    return this.sanitize(saved);
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepo.find({
      order: { createdAt: 'DESC' },
    });

    return users.map((user) => this.sanitize(user));
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return this.sanitize(user);
  }

  async findEntityById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { email },
    });
  }

  async update(
    id: string,
    dto: UpdateUserDto,
    updatedById?: string,
  ): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    Object.assign(user, dto, { updatedById });

    const saved = await this.userRepo.save(user);
    return this.sanitize(saved);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepo.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
  }
}