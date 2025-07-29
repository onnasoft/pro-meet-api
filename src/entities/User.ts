import { Role } from '@/types/role';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Organization } from './Organization';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, type: 'varchar' })
  phone?: string | null;

  @Column({ select: false })
  password: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true, type: 'varchar', select: false })
  verificationToken: string | null;

  @Column({ nullable: true, type: 'timestamp', select: false })
  verificationTokenExpiresAt: Date | null;

  @Column({ nullable: true, type: 'varchar', select: false })
  passwordResetToken: string | null;

  @Column({ nullable: true, type: 'timestamp', select: false })
  passwordResetTokenExpiresAt: Date | null;

  @Column({
    type: 'enum',
    enum: ['es', 'en', 'fr', 'ja', 'zh'],
    default: 'en',
  })
  language: string;

  @Column({
    type: 'enum',
    enum: [Role.User, Role.Admin],
    default: Role.User,
  })
  role: Role;

  @Column({ type: 'varchar', length: 100, default: 'UTC' })
  timezone: string;

  @OneToMany(() => Organization, (organization) => organization.owner, {
    cascade: true,
  })
  organizations: Organization[];

  @Column({ nullable: true, type: 'varchar' })
  stripeCustomerId?: string;

  @Column({ nullable: true, type: 'varchar' })
  defaultPaymentMethodId?: string;

  @Column({ default: false })
  newsletter?: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date | null;
}
