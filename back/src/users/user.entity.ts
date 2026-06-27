import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
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

@Column({ type: 'varchar', nullable: true, select: false })
verificationToken?: string | null;

@Column({ type: 'varchar', nullable: true, select: false })
resetPasswordToken?: string | null;

@Column({ type: 'datetime', nullable: true, select: false })
resetPasswordExpires?: Date | null;

@CreateDateColumn()
createdAt!: Date;

@Column({ select: false })
passwordHash!: string;

}