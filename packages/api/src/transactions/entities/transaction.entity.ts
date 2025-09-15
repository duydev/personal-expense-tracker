import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { TransactionType } from '../enums/transaction-types.enum';

@Entity()
export class Transaction extends BaseEntity {
  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @ManyToOne(() => User, (user) => user.transactions, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Category, (category) => category.transactions, {
    nullable: false,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'decimal', precision: 10, scale: 0 })
  amount: number;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'timestamptz', name: 'incurred_at' })
  incurredAt: Date;
}
