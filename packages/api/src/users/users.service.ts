import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/services/base.service';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async findByIdOrFail(id: number): Promise<User> {
    return this.userRepository.findOneOrFail({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async findByActivationToken(token: string): Promise<User | null> {
    return this.userRepository.findOneBy({ activationToken: token });
  }

  async findByResetPasswordToken(token: string): Promise<User | null> {
    return this.userRepository.findOneBy({ resetPasswordToken: token });
  }
}
