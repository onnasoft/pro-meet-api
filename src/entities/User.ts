import { Role } from '@/types/role';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Organization } from './Organization';
import { Plan } from './Plan';
import { Post } from './Post';
import { PostLike } from './PostLike';
import { PostComment } from './PostComment';
import { PostShare } from './PostShare';
import { UserType } from '@/types/user-type';
import { PlanStatus } from '@/types/plan-status';
import { Profile } from './Profile';

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

  @Column({
    type: 'enum',
    enum: [UserType.CANDIDATE, UserType.RECRUITER],
  })
  userType: UserType;

  @Column({ type: 'varchar', length: 100, default: 'UTC' })
  timezone: string;

  @Column({ nullable: true, type: 'varchar' })
  avatarUrl: string;

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
  })
  profile: Profile;

  @OneToMany(() => Organization, (organization) => organization.owner, {
    cascade: true,
  })
  organizations: Organization[];

  @OneToMany(() => Post, (post) => post.user, { cascade: true })
  posts: Post[];

  @OneToMany(() => PostLike, (like) => like.user)
  postLikes: PostLike[];

  @OneToMany(() => PostComment, (comment) => comment.user)
  postComments: PostComment[];

  @OneToMany(() => PostShare, (share) => share.user)
  postShares: PostShare[];

  @Column({ nullable: true, type: 'varchar' })
  stripeCustomerId?: string;

  @Column({ nullable: true, type: 'varchar' })
  defaultPaymentMethodId?: string;

  @Column({ nullable: true, type: 'varchar', select: false })
  planId: string;

  @OneToOne(() => Plan, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'planId' })
  plan?: Plan;

  @Column({ type: 'timestamp', nullable: true })
  planStartDate: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  planEndDate: Date | null;

  @Column({
    type: 'enum',
    enum: [
      PlanStatus.ACTIVE,
      PlanStatus.CANCELED,
      PlanStatus.PAST_DUE,
      PlanStatus.UNPAID,
      PlanStatus.INCOMPLETE,
      PlanStatus.INCOMPLETE_EXPIRED,
      PlanStatus.TRIALING,
      PlanStatus.PAUSED,
    ],
    default: PlanStatus.ACTIVE,
    select: true,
    comment: "The status of the user's subscription plan",
  })
  planStatus: PlanStatus;

  @Column({ nullable: true, type: 'varchar', select: false })
  stripeSubscriptionId: string | null;

  @Column({ default: false })
  newsletter?: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date | null;
}
