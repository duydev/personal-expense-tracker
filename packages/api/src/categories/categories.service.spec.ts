import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { ListCategoriesDto } from './dto/list-category-filters.dto';
import { CategoryType } from './enums/category-types.enum';
import { User } from '../users/entities/user.entity';

// Mock the pagination utilities
const mockToLimit = jest.fn((n: number) => n);
const mockToSkip = jest.fn((page: number, limit: number) => (page - 1) * limit);
const mockToPageCount = jest.fn((total: number, limit: number) =>
  Math.ceil(total / limit),
);

jest.mock('../../common/utils/pagination.util', () => ({
  toLimit: mockToLimit,
  toSkip: mockToSkip,
  toPageCount: mockToPageCount,
}));

// Mock the BaseService
jest.mock('../../common/services/base.service');

describe('CategoriesService', () => {
  let service: CategoriesService;

  const mockCategory: Category = {
    id: 1,
    name: 'Test Category',
    type: CategoryType.EXPENSE,
    user: { id: 1 } as unknown as User,
    description: '',
    transactions: [],
    createdAt: new Date(),
    createdBy: 1,
    updatedAt: new Date(),
    updatedBy: 1,
    deletedAt: null,
    deletedBy: null,
  };

  const mockCategoryRepository = {
    createQueryBuilder: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return categories with default pagination', async () => {
      const userId = 1;
      const options: ListCategoriesDto = {};

      // Mock the repository response
      const mockCategories = [mockCategory];
      const mockTotal = 1;
      (mockCategoryRepository.getManyAndCount as jest.Mock).mockResolvedValue([
        mockCategories,
        mockTotal,
      ]);

      const result = await service.findAll(userId, options);

      expect(mockCategoryRepository.createQueryBuilder).toHaveBeenCalledTimes(
        1,
      );
      expect(mockCategoryRepository.createQueryBuilder).toHaveBeenCalledWith(
        'category',
      );
      expect(mockCategoryRepository.where).toHaveBeenCalledTimes(1);
      expect(mockCategoryRepository.where).toHaveBeenCalledWith(
        'category.user.id = :userId',
        { userId },
      );
      expect(mockCategoryRepository.orderBy).toHaveBeenCalledTimes(1);
      expect(mockCategoryRepository.orderBy).toHaveBeenCalledWith(
        'category.createdAt',
        'DESC',
      );
      expect(result).toEqual({
        data: mockCategories,
        total: mockTotal,
        pageSize: mockTotal, // Because we're not providing pageSize in options
        page: 1,
        pageCount: 1,
      });
    });

    it('should filter by type when provided', async () => {
      const mockCategories = [
        { id: 1, name: 'Test', type: CategoryType.EXPENSE },
      ];

      (
        mockCategoryRepository.getManyAndCount as jest.Mock
      ).mockResolvedValueOnce([mockCategories, 1]);

      const userId = 1;
      const options: ListCategoriesDto = {
        type: CategoryType.EXPENSE,
      };

      await service.findAll(userId, options);

      expect(mockCategoryRepository.andWhere).toHaveBeenCalledTimes(1);
      expect(mockCategoryRepository.andWhere).toHaveBeenCalledWith(
        'category.type = :type',
        { type: CategoryType.EXPENSE },
      );
    });

    it('should apply pagination when pageSize is provided', async () => {
      const userId = 1;
      const options: ListCategoriesDto = {
        page: 2,
        pageSize: 10,
      };

      await service.findAll(userId, options);

      expect(mockCategoryRepository.skip).toHaveBeenCalledWith(10);
      expect(mockCategoryRepository.take).toHaveBeenCalledWith(10);
    });
  });

  describe('find', () => {
    it('should find a category by id and user id', async () => {
      const id = 1;
      const userId = 1;
      const mockCategory = { id: 1, name: 'Test', userId: 1 };

      (mockCategoryRepository.findOne as jest.Mock).mockResolvedValue(
        mockCategory,
      );

      const result = await service.find(userId, id);

      expect(mockCategoryRepository.findOne).toHaveBeenCalledWith({
        where: { id, user: { id: userId } },
        relations: ['user'],
      });
      expect(result).toEqual(mockCategory);
    });
  });
});
