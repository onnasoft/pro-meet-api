import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { OrganizationMember } from './OrganizationMember';
import { Project } from './Project';
import { TaskLabel } from './TaskLabel';
import { OrganizationPlan, OrganizationStatus } from '@/types/organization';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  website?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  location?: string | null;

  @Column({ nullable: true, length: 20, type: 'varchar' })
  phone?: string | null;

  @Column({ name: 'logo_url', nullable: true, type: 'varchar' })
  logoUrl?: string | null;

  @Column({ name: 'billing_email', nullable: true, type: 'varchar' })
  billingEmail?: string | null;

  @Column({
    type: 'enum',
    enum: OrganizationPlan,
    default: OrganizationPlan.FREE,
  })
  plan: OrganizationPlan;

  @Column({
    type: 'enum',
    enum: OrganizationStatus,
    default: OrganizationStatus.ACTIVE,
  })
  status: OrganizationStatus;

  @Column({ default: false })
  current: boolean;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ name: 'owner_id' })
  ownerId: string;

  @OneToMany(() => OrganizationMember, (member) => member.organization)
  members: OrganizationMember[];

  @OneToMany(() => Project, (project) => project.organization)
  projects: Project[];

  @OneToMany(() => TaskLabel, (taskLabel) => taskLabel.organization)
  taskLabels: TaskLabel[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
