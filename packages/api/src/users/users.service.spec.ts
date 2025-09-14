import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepo: {
    find: jest.Mock;
    findOne: jest.Mock;
    save: jest.Mock;
    // Add more methods as needed
  };

  beforeEach(async () => {
    mockRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      // Add more methods as needed
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockRepo },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', async () => {
    const users = [{ id: 1, email: 'test@example.com' }];
    mockRepo.find.mockResolvedValue(users);
    expect(await service.findAll()).toEqual(users);
  });

  // Add more tests for other service methods, mocking repo methods as needed
});
