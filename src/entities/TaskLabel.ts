import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import { Organization } from './Organization';
import { Task } from './Task';

@Entity('task_labels')
export class TaskLabel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 7 }) // Para código HEX de color (#RRGGBB)
  color: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  // Relación con la organización
  @ManyToOne(() => Organization, (organization) => organization.taskLabels)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'organization_id' })
  organizationId: string;

  // Relación con tareas (many-to-many)
  @ManyToMany(() => Task, (task) => task.labels)
  tasks: Task[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
