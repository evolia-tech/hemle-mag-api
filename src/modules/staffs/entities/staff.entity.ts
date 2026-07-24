import {
  Entity,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { BaseEntity } from '../../../database/base.entity';
import { Role } from '../enums/role.enum';
import * as bcrypt from 'bcrypt';

@Entity('staffs')
export class Staff extends BaseEntity {
  @Column({
    type: 'varchar',
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    select: false, // Ne jamais retourner le password automatiquement
  })
  password: string;

  @Column({
    name: 'first_name',
    type: 'varchar',
  })
  firstName: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
  })
  lastName: string;

  /**
   * Tableau de rôles RBAC. Un membre peut avoir plusieurs rôles.
   * Ex: ['ADMIN', 'EDITOR'] ou ['SUPER_ADMIN', 'ADMIN', 'EDITOR']
   */
  @Column({
    type: 'simple-array',
    default: Role.EDITOR,
  })
  roles: Role[];

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  // ─── Champs Auteur (visibles côté public sur les articles) ───────────────

  /**
   * Slug URL-friendly de l'auteur, ex: "jean-dupont"
   * Utilisé pour la page auteur côté public.
   */
  @Column({
    type: 'varchar',
    unique: true,
    nullable: true,
  })
  slug: string | null;

  /**
   * Courte biographie affichée sous les articles rédigés.
   */
  @Column({
    type: 'text',
    nullable: true,
  })
  bio: string | null;

  /**
   * URL de l'avatar / photo de profil de l'auteur.
   */
  @Column({
    name: 'avatar_url',
    type: 'varchar',
    nullable: true,
  })
  avatarUrl: string | null;

  /**
   * Titre affiché sous le nom (ex: "Rédacteur en chef", "Journaliste")
   */
  @Column({
    name: 'job_title',
    type: 'varchar',
    nullable: true,
  })
  jobTitle: string | null;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    nullable: true,
  })
  phoneNumber: string | null;

  // ─── Hooks ───────────────────────────────────────────────────────────────

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (
      this.password &&
      !this.password.startsWith('$2a$') &&
      !this.password.startsWith('$2b$') &&
      !this.password.startsWith('$2y$')
    ) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────

  async comparePassword(attempt: string): Promise<boolean> {
    return bcrypt.compare(attempt, this.password);
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  hasRole(role: Role): boolean {
    return this.roles?.includes(role) ?? false;
  }

  hasAnyRole(...roles: Role[]): boolean {
    return roles.some((r) => this.roles?.includes(r));
  }
}