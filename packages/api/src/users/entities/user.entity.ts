import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
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

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'bigint', nullable: true })
  createdBy: number | null;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'bigint', nullable: true })
  updatedBy: number | null;
}
