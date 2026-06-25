import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './user.types';

@Entity('users')
export class UserEntity {
@PrimaryGeneratedColumn('uuid')
id!: string;

@Column({ nullable: true })
name?: string;

@Column({ unique: true })
email!: string;

@Column({ type: 'text', default: UserRole.USER })
role!: UserRole;

@Column({ type: 'boolean', default: false})
isVerified!: boolean;

@Column({ nullable: true, select: false })
verificationToken?: string | null;

@Column({ select: false })
passwordHash!: string;

}