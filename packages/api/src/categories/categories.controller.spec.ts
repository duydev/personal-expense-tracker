import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { ListCategoriesDto } from './dto/list-category-filters.dto';
import { Category } from './entities/category.entity';
import { CategoryType } from './enums/category-types.enum';
import { User } from '../users/entities/user.entity';

// Helper function to create a mock user with all required properties
const createMockUser = (): User => ({
  id: 1,
  email: 'test@example.com',
  password: 'hashedpassword',
  name: 'Test User',
  isActive: true,
  activationToken: null,
  resetPasswordToken: null,
  resetPasswordExpires: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 1,
  updatedBy: 1,
  deletedAt: null,
  deletedBy: null,
  categories: [],
  transactions: [],
});

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let categoriesService: CategoriesService;
  let mockUser: User;

  beforeEach(() => {
    mockUser = createMockUser();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: {
            findAll: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    categoriesService = module.get<CategoriesService>(CategoriesService);
  });

  describe('findAll', () => {
    it('should return categories with pagination', async () => {
      const mockCategory: Category = {
        id: 1,
        name: 'Test Category',
        description: 'Test Description',
        type: CategoryType.EXPENSE,
        user: mockUser as User,
        transactions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 1,
        updatedBy: 1,
        deletedAt: null,
        deletedBy: null,
      };

      const mockResult = {
        data: [mockCategory],
        total: 1,
        page: 1,
        pageSize: 10,
        pageCount: 1,
      };

      jest.spyOn(categoriesService, 'findAll').mockResolvedValue(mockResult);

      const query: ListCategoriesDto = {};
      // Test the controller method
      const result = await controller.findAll(mockUser, query);

      expect(result).toEqual(mockResult);
      expect(categoriesService.findAll).toHaveBeenCalledWith(
        mockUser.id,
        expect.any(Object),
      );
    });
  });

  describe('findOne', () => {
    it('should return a single category', async () => {
      const mockCategory: Category = {
        id: 1,
        name: 'Test Category',
        description: 'Test Description',
        type: CategoryType.EXPENSE,
        user: mockUser,
        transactions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 1,
        updatedBy: 1,
        deletedAt: null,
        deletedBy: null,
      };

      jest.spyOn(categoriesService, 'find').mockResolvedValue(mockCategory);

      // Test the controller method
      const result = await controller.findOne(mockUser, '1');

      expect(result).toEqual(mockCategory);
      expect(categoriesService.find).toHaveBeenCalledWith(mockUser.id, 1);
    });
  });
});
