import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ListCategoryFiltersDto } from './dto/list-category-filters.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
@ApiBearerAuth()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of categories.',
    example: {
      data: [
        {
          id: 1,
          name: 'Food',
          description: 'Expenses for food and groceries',
          createdAt: '2023-10-01T12:00:00Z',
          updatedAt: '2023-10-01T12:00:00Z',
        },
        {
          id: 2,
          name: 'Transport',
          description: 'Expenses for transportation',
          createdAt: '2023-10-01T12:00:00Z',
          updatedAt: '2023-10-01T12:00:00Z',
        },
      ],
      total: 2,
      pageSize: 10,
      page: 1,
      pageCount: 1,
    },
  })
  async findAll(
    @GetUser() user: User,
    @Query() params: ListCategoryFiltersDto,
  ) {
    return this.categoriesService.findAllForUser(user.id, params);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The category has been found.',
    example: {
      id: 1,
      name: 'Food',
      description: 'Expenses for food and groceries',
      createdAt: '2023-10-01T12:00:00Z',
      updatedAt: '2023-10-01T12:00:00Z',
    },
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async findOne(@GetUser() user: User, @Param('id') id: string) {
    const category = await this.categoriesService.findByIdForUser(user.id, +id);

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  @Post()
  @ApiBody({
    type: CreateCategoryDto,
    examples: {
      example1: {
        summary: 'Basic Example',
        value: {
          type: 'expense',
          name: 'Utilities',
          description: 'Expenses for utilities like electricity and water',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The category has been created.',
    example: {
      id: 3,
      name: 'Utilities',
      description: 'Expenses for utilities like electricity and water',
      createdAt: '2023-10-01T12:00:00Z',
      updatedAt: '2023-10-01T12:00:00Z',
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async create(@GetUser() user: User, @Body() dto: CreateCategoryDto) {
    console.log('>>', dto, user);

    return this.categoriesService.create({ ...dto, user: { id: user.id } });
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'The category has been updated.',
    example: {
      id: 1,
      name: 'Updated Category Name',
      description: 'Updated description for the category',
      createdAt: '2023-10-01T12:00:00Z',
      updatedAt: '2023-10-02T12:00:00Z',
    },
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async update(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    const category = await this.findOne(user, id);

    return this.categoriesService.update(category.id, dto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'The category has been deleted.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async delete(@GetUser() user: User, @Param('id') id: string) {
    const category = await this.findOne(user, id);

    return this.categoriesService.delete(category.id);
  }
}
