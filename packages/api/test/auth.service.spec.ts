import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue('signed-token'),
      verify: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw if email already exists on register', async () => {
    (usersService.findByEmail as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'test@example.com',
    });
    await expect(
      service.register({
        name: 'Test User',
        email: 'test@example.com',
        password: '12345678',
      }),
    ).rejects.toThrow();
  });

  it('should create user if email does not exist', async () => {
    (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
    (usersService.create as jest.Mock).mockResolvedValue({
      id: 2,
      email: 'new@example.com',
    });
    const result = await service.register({
      name: 'New User',
      email: 'new@example.com',
      password: '12345678',
    });
    expect(result).toEqual({ id: 2, email: 'new@example.com' });
  });
});
