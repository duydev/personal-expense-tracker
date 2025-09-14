import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { comparePasswords, hashPassword } from 'src/common/utils/password.util';
import { generateToken } from 'src/common/utils/token.util';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userData: RegisterDto) {
    const existingUser = await this.userService.findByEmail(userData.email);

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await hashPassword(userData.password);
    const activationToken = generateToken();
    const user = await this.userService.create({
      ...userData,
      password: hashedPassword,
      activationToken,
    });

    return user;
  }

  async activateAccount(token: string) {
    const user = await this.userService.findByActivationToken(token);

    if (!user) {
      throw new BadRequestException('Invalid activation token');
    }

    if (user.isActive) {
      throw new BadRequestException('Account is already activated');
    }

    user.isActive = true;
    user.activationToken = null;

    await this.userService.update(user.id, user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);

    return user && (await comparePasswords(password, user.password))
      ? user
      : null;
  }

  login(user: User) {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return { accessToken, refreshToken, user };
  }

  async sendPasswordResetEmail(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      // do nothing to prevent email enumeration
      return;
    }

    const resetToken = generateToken();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    await this.userService.update(user.id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpiry,
    });

    // send email logic here (omitted for brevity)
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userService.findByResetPasswordToken(token);

    if (
      !user ||
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < new Date()
    ) {
      throw new BadRequestException('Invalid or expired reset token');
    }
    const hashedPassword = await hashPassword(newPassword);

    await this.userService.update(user.id, {
      ...user,
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
  }

  refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<{ sub: number; email: string }>(
        refreshToken,
      );
      const accessToken = this.jwtService.sign(payload);

      return { accessToken, refreshToken };
    } catch {
      throw new BadRequestException('Invalid refresh token');
    }
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!(await comparePasswords(currentPassword, user.password))) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await hashPassword(newPassword);
    await this.userService.update(user.id, { password: hashedPassword });
  }
}
