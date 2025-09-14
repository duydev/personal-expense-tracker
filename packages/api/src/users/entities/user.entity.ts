import { Exclude } from 'class-transformer';
import { Category } from 'src/categories/entities/category.entity';
import { Expense } from 'src/expenses/entities/expense.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  name: string;

  @Column({ default: false, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true, name: 'activation_token' })
  @Exclude()
  activationToken: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'reset_password_token' })
  @Exclude()
  resetPasswordToken: string | null;

  @Column({
    type: 'timestamptz',
    nullable: true,
    name: 'reset_password_expires',
  })
  @Exclude()
  resetPasswordExpires: Date | null;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @Column({ type: 'bigint', nullable: true, name: 'created_by' })
  createdBy: number | null;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt: Date;

  @Column({ type: 'bigint', nullable: true, name: 'updated_by' })
  updatedBy: number | null;

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @OneToMany(() => Expense, (expense) => expense.user)
  expenses: Expense[];
}
