import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { BaseService } from 'src/common/services/base.service';
import { ListCategoriesDto } from './dto/list-category.dto';
import { toLimit, toSkip, toPageCount } from 'src/common/utils/pagination.util';

@Injectable()
export class CategoriesService extends BaseService<Category> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {
    super(categoryRepository);
  }

  async findAll(userId: number, options: ListCategoriesDto) {
    const {
      page = 1,
      pageSize,
      sort = 'createdAt',
      sortOrder = 'DESC',
      type,
    } = options;

    const query = this.categoryRepository
      .createQueryBuilder('category')
      .where('category.user.id = :userId', { userId })
      .orderBy(`category.${sort}`, sortOrder.toUpperCase() as 'ASC' | 'DESC');

    if (type) {
      query.andWhere('category.type = :type', { type });
    }

    if (pageSize) {
      const skip = toSkip(page, toLimit(pageSize));
      query.skip(skip).take(toLimit(pageSize));
    }

    const [data, total] = await query.getManyAndCount();

    const limit = pageSize ? toLimit(pageSize) : total;
    const pageCount = toPageCount(total, limit);

    return {
      data,
      total,
      pageSize: limit,
      page,
      pageCount,
    };
  }

  async find(userId: number, id: number) {
    return this.categoryRepository.findOne({
      where: {
        id,
        user: { id: userId },
      },
    });
  }
}
