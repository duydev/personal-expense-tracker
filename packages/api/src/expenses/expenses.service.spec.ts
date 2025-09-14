import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExpensesService } from './expenses.service';
import { Expense } from './entities/expense.entity';

describe('ExpensesService', () => {
  let service: ExpensesService;
  let mockRepo: {
    find: jest.Mock;
    findOneBy: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    mockRepo = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        { provide: getRepositoryToken(Expense), useValue: mockRepo },
      ],
    }).compile();
    service = module.get<ExpensesService>(ExpensesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all expenses', async () => {
    const expenses = [{ id: 1, amount: 100 }];
    mockRepo.find.mockResolvedValue(expenses);
    expect(await service.findAll()).toEqual(expenses);
  });

  it('should return an expense by id', async () => {
    const expense = { id: 1, amount: 100 };
    mockRepo.findOneBy.mockResolvedValue(expense);
    expect(await service.findById(1)).toEqual(expense);
  });

  it('should create an expense', async () => {
    const data = { amount: 200 };
    const entity = { id: 2, ...data };
    mockRepo.create.mockReturnValue(entity);
    mockRepo.save.mockResolvedValue(entity);
    expect(await service.create(data)).toEqual(entity);
  });

  it('should update an expense', async () => {
    const id = 1;
    const data = { amount: 300 };
    const updated = { id, ...data };
    mockRepo.update.mockResolvedValue(undefined);
    mockRepo.findOneBy.mockResolvedValue(updated);
    expect(await service.update(id, data)).toEqual(updated);
  });

  it('should delete an expense', async () => {
    mockRepo.delete.mockResolvedValue(undefined);
    await expect(service.delete(1)).resolves.toBeUndefined();
  });
});
