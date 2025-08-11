import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Organization } from './Organization';
import { User } from './User';
import { Task } from './Task';
import { ProjectStatus, ProjectVisibility } from '@/types/project';
import { Job } from './Job';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ name: 'key_code', length: 10, unique: true })
  keyCode: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.PLANNING,
  })
  status: ProjectStatus;

  @Column({
    type: 'enum',
    enum: ProjectVisibility,
    default: ProjectVisibility.TEAM,
  })
  visibility: ProjectVisibility;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate?: Date | null;

  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate?: Date | null;

  @Column({ nullable: true, type: 'varchar' })
  website?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  location?: string | null;

  @Column({ nullable: true, length: 20, type: 'varchar' })
  phone?: string | null;

  @Column({ name: 'logo_url', nullable: true, type: 'varchar' })
  logoUrl?: string | null;

  @Column({ name: 'is_template', default: false })
  isTemplate: boolean;

  // Relación con la organización
  @ManyToOne(() => Organization, (organization) => organization.projects)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  // Relación con el líder del proyecto
  @ManyToOne(() => User)
  @JoinColumn({ name: 'leader_id' })
  leader: User;

  @Column({ name: 'leader_id' })
  leaderId: string;

  // Relación con miembros del proyecto
  @ManyToMany(() => User)
  @JoinTable({
    name: 'project_members',
    joinColumn: {
      name: 'project_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  members: User[];

  @OneToMany(() => Job, (job) => job.project)
  jobs: Job[];

  // Relación con tareas
  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
