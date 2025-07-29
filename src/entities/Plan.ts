import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { PlanTranslation } from './PlanTranslation';

@Entity('plans')
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    select: false,
    nullable: true,
  })
  stripePriceId: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  hidden: boolean;

  @Column({ type: 'enum', enum: ['month', 'year'], default: 'month' })
  period: 'month' | 'year';

  @OneToMany(() => PlanTranslation, (translation) => translation.plan, {
    cascade: true,
  })
  @JoinColumn()
  translations: PlanTranslation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
