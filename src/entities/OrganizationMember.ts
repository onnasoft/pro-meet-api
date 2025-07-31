import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Organization } from './Organization';
import { User } from './User';
import { MemberRole, MemberStatus } from '@/types/organization-member';

@Entity('organization_members')
@Unique(['organizationId', 'email'])
export class OrganizationMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'organization_id' })
  organizationId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column({ name: 'user_id', nullable: true })
  userId: string | null;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: MemberRole,
    default: MemberRole.MEMBER,
  })
  role: MemberRole;

  @Column({
    type: 'enum',
    enum: MemberStatus,
    default: MemberStatus.PENDING,
  })
  status: MemberStatus;

  @Column({
    name: 'invitation_token',
    nullable: true,
    type: 'varchar',
    select: false,
  })
  invitationToken: string | null;

  @Column({ name: 'invitation_sent_at', nullable: true, type: 'timestamp' })
  invitationSentAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
