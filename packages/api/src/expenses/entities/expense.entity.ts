import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.expenses)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Category, (category) => category.expenses)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'decimal', precision: 10, scale: 0 })
  amount: number;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  incurredAt: Date | null;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'bigint', nullable: true })
  createdBy: number | null;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'bigint', nullable: true })
  updatedBy: number | null;
}
