import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';

describe('CategoriesService', () => {
  let service: CategoriesService;
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
        CategoriesService,
        { provide: getRepositoryToken(Category), useValue: mockRepo },
      ],
    }).compile();
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all categories', async () => {
    const categories = [{ id: 1, name: 'Food' }];
    mockRepo.find.mockResolvedValue(categories);
    expect(await service.findAll()).toEqual(categories);
  });

  it('should return a category by id', async () => {
    const category = { id: 1, name: 'Food' };
    mockRepo.findOneBy.mockResolvedValue(category);
    expect(await service.findById(1)).toEqual(category);
  });

  it('should create a category', async () => {
    const data = { name: 'Transport' };
    const entity = { id: 2, ...data };
    mockRepo.create.mockReturnValue(entity);
    mockRepo.save.mockResolvedValue(entity);
    expect(await service.create(data)).toEqual(entity);
  });

  it('should update a category', async () => {
    const id = 1;
    const data = { name: 'Updated' };
    const updated = { id, ...data };
    mockRepo.update.mockResolvedValue(undefined);
    mockRepo.findOneBy.mockResolvedValue(updated);
    expect(await service.update(id, data)).toEqual(updated);
  });

  it('should delete a category', async () => {
    mockRepo.delete.mockResolvedValue(undefined);
    await expect(service.delete(1)).resolves.toBeUndefined();
  });
});
