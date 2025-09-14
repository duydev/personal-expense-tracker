import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { Throttle } from '@nestjs/throttler';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  @ApiBody({
    type: RegisterDto,
    examples: {
      'register-example': {
        summary: 'Example user registration',
        value: {
          name: 'John Doe',
          email: 'user@example.com',
          password: 'securePassword123',
        },
      },
    },
  })
  async register(@Body() userData: RegisterDto) {
    const user = await this.authService.register(userData);

    return { message: 'User registered successfully', user };
  }

  @Post('activate')
  @Public()
  @ApiOperation({ summary: 'Activate user account' })
  @ApiResponse({ status: 200, description: 'Account activated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({
    description: 'Activation token',
    type: String,
    examples: {
      'activation-example': {
        summary: 'Example activation token',
        value: {
          token: 'your-activation-token-here',
        },
      },
    },
  })
  async activateAccount(@Body('token') token: string) {
    await this.authService.activateAccount(token);

    return { message: 'Account activated successfully' };
  }

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    example: {
      accessToken: 'your-access-token-here',
      refreshToken: 'your-refresh-token-here',
      user: { id: 1, name: 'John Doe', email: 'user@example.com' },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({
    type: LoginDto,
    examples: {
      'login-example': {
        summary: 'Example user login',
        value: {
          email: 'user@example.com',
          password: 'securePassword123',
        },
      },
    },
  })
  login(@Request() req: Request & { user: User }) {
    const result = this.authService.login(req.user);

    return { message: 'Login successful', ...result };
  }

  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  logout() {
    return { message: 'Logout successful' };
  }

  @Post('password-reset')
  @Public()
  @Throttle({ default: { limit: 3, ttl: 3600 } }) // 3 requests per hour per IP
  @ApiOperation({ summary: 'Send password reset email' })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent if the email exists',
  })
  @ApiBody({
    description: 'User email for password reset',
    type: String,
    examples: {
      'password-reset-example': {
        summary: 'Example password reset request',
        value: {
          email: 'user@example.com',
        },
      },
    },
  })
  async sendPasswordResetEmail(@Body('email') email: string) {
    await this.authService.sendPasswordResetEmail(email);

    return { message: 'Password reset email sent' };
  }

  @Post('reset-password')
  @Public()
  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({
    description: 'Reset token and new password',
    type: Object,
    examples: {
      'reset-password-example': {
        summary: 'Example password reset',
        value: {
          token: 'your-reset-token-here',
          newPassword: 'newSecurePassword123',
        },
      },
    },
  })
  async resetPassword(token: string, newPassword: string) {
    await this.authService.resetPassword(token, newPassword);

    return { message: 'Password has been reset successfully' };
  }

  @Post('refresh-token')
  @Public()
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    example: {
      accessToken: 'your-access-token-here',
      refreshToken: 'your-refresh-token-here',
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({
    description: 'Refresh token',
    type: String,
    examples: {
      'refresh-token-example': {
        summary: 'Example refresh token request',
        value: {
          refreshToken: 'your-refresh-token-here',
        },
      },
    },
  })
  refreshToken(@Body() body: { refreshToken: string }) {
    const result = this.authService.refreshToken(body.refreshToken);

    return { message: 'Token refreshed successfully', ...result };
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    status: 200,
    description: 'Current user retrieved successfully',
    example: {
      id: 1,
      name: 'John Doe',
      email: 'user@example.com',
    },
  })
  getCurrentUser(@Request() req: Request & { user: User }) {
    return { user: req.user };
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({
    description: 'Current and new password',
    type: Object,
    examples: {
      'change-password-example': {
        summary: 'Example change password request',
        value: {
          currentPassword: 'currentSecurePassword123',
          newPassword: 'newSecurePassword123',
        },
      },
    },
  })
  async changePassword(
    @Request() req: Request & { user: User },
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    await this.authService.changePassword(
      req.user.id,
      body.currentPassword,
      body.newPassword,
    );

    return { message: 'Password changed successfully' };
  }
}
