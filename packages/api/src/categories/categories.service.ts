import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { BaseService } from 'src/common/services/base.service';
import { ListCategoryFiltersDto } from './dto/list-category-filters.dto';
import {
  getPaginationOptions,
  toPageCount,
} from 'src/common/utils/pagination.util';
import { getSortOptions } from 'src/common/utils/sort.util';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService extends BaseService<Category> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {
    super(categoryRepository);
  }

  async findAllForUser(userId: number, filters: ListCategoryFiltersDto) {
    const { page, pageSize, take, skip } = getPaginationOptions(
      filters.pageSize,
      filters.page,
    );
    const { sort, sortOrder } = getSortOptions(filters.sort, filters.sortOrder);
    const { type } = filters;

    const query = this.categoryRepository
      .createQueryBuilder('category')
      .where('category.user.id = :userId', { userId })
      .orderBy(`category.${sort}`, sortOrder)
      .take(take)
      .skip(skip);

    if (type) {
      query.andWhere('category.type = :type', { type });
    }

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      pageSize,
      page,
      pageCount: toPageCount(total, pageSize),
    };
  }

  async findByIdForUser(userId: number, id: number) {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
        user: { id: userId },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async createForUser(userId: number, dto: CreateCategoryDto) {
    const category = this.categoryRepository.create({
      ...dto,
      user: { id: userId },
      createdBy: userId,
      updatedBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.categoryRepository.save(category);
  }

  async updateForUser(userId: number, id: number, dto: UpdateCategoryDto) {
    const category = await this.findByIdForUser(userId, id);
    const updatedCategory = this.categoryRepository.merge(category, {
      ...dto,
      updatedBy: userId,
      updatedAt: new Date(),
    });

    return this.categoryRepository.save(updatedCategory);
  }

  async deleteForUser(userId: number, id: number) {
    const category = await this.findByIdForUser(userId, id);
    const deletedCategory = this.categoryRepository.merge(category, {
      deletedBy: userId,
    });
    await this.categoryRepository.softRemove(deletedCategory);
  }
}
