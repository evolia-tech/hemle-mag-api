import { Entity, Column, Index, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Entité Media
 * 
 * Représente un fichier stocké (image, vidéo, PDF, etc.)
 * 
 * Caractéristiques :
 * - Polymorphique : peut être lié à n'importe quelle ressource
 * - Supporte le soft delete
 * - Gère l'ordre d'affichage (sortOrder)
 * - Distinction public/privé
 */
@Entity('media')
@Index(['entityType', 'entityId'])
export class Media {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column()
filename: string;

@Column()
key: string;

@Column({ nullable: true })
publicUrl?: string;

@Column()
mimeType: string;

@Column('bigint')
size: number;

@Column()
entityType: string;

@Column()
entityId: string;

@Column({ default: false })
isPrimary: boolean;

@Column({ default: false })
isPrivate: boolean;

@Column({ default: 0 })
sortOrder: number;

@CreateDateColumn()
createdAt: Date;

@UpdateDateColumn()
updatedAt: Date;

@DeleteDateColumn()
deletedAt?: Date;
}