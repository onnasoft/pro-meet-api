import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './User';
import { Post } from './Post';

@Entity()
@Unique(['user', 'post'])
export class PostShare {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.postShares, { eager: true })
  user: User;

  @ManyToOne(() => Post, (post) => post.shares, { onDelete: 'CASCADE' })
  post: Post;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date | null;
}
