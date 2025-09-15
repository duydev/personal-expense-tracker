import { Injectable } from '@nestjs/common';
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
    return this.categoryRepository.findOne({
      where: {
        id,
        user: { id: userId },
      },
    });
  }
}
