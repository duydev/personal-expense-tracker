import { Exclude } from 'class-transformer';
import { Category } from 'src/categories/entities/category.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
export class User extends BaseEntity {
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

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];
}
