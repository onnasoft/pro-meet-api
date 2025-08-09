import { ContractType, JobStatus, JobType } from '@/types/job';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Organization } from './Organization';

@Entity()
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.OPEN,
  })
  status: JobStatus;

  @Column({
    type: 'enum',
    enum: JobType,
  })
  jobType: JobType;

  @Column({
    type: 'enum',
    enum: ContractType,
  })
  contractType: ContractType;

  @Column({ type: 'decimal', nullable: true, precision: 10, scale: 2 })
  salaryMin?: number;

  @Column({ type: 'decimal', nullable: true, precision: 10, scale: 2 })
  salaryMax?: number;

  @Column({ length: 255, nullable: true })
  location?: string;

  @Column({ type: 'timestamp', nullable: true })
  postedAt?: Date;

  @Column()
  isActive: boolean;

  @Column({ type: 'decimal', nullable: true, precision: 10, scale: 2 })
  recruiterFee?: number;

  @Column({ nullable: true })
  experienceRequired?: string;

  @Column({ nullable: true })
  educationLevel?: string;

  @Column({ nullable: true })
  skillsRequired?: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
