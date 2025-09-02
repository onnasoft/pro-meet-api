import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './User';
import { Post } from './Post';

@Entity()
export class PostComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  post: Post;

  @ManyToOne(() => User, (user) => user.postComments, { eager: true })
  user: User;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => PostComment, (comment) => comment.replies, {
    nullable: true,
  })
  parent?: PostComment;

  @OneToMany(() => PostComment, (comment) => comment.parent)
  replies: PostComment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date | null;
}
