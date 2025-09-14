import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async findByIdOrFail(id: number): Promise<User> {
    return this.userRepository.findOneOrFail({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async findByActivationToken(token: string): Promise<User | null> {
    return this.userRepository.findOneBy({
      activationToken: token,
    });
  }

  async findByResetPasswordToken(token: string): Promise<User | null> {
    return this.userRepository.findOneBy({
      resetPasswordToken: token,
    });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);

    return this.userRepository.save(user);
  }

  async update(id: number, updateData: Partial<User>): Promise<User | null> {
    await this.userRepository.update(id, updateData);

    return this.userRepository.findOneBy({ id });
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
