import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { BaseService } from 'src/common/services/base.service';
import { ListTransactionFiltersDto } from './dto/list-transaction-filters.dto';
import {
  getPaginationOptions,
  toPageCount,
} from 'src/common/utils/pagination.util';
import { getSortOptions } from 'src/common/utils/sort.util';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class TransactionsService extends BaseService<Transaction> {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly categoriesService: CategoriesService,
  ) {
    super(transactionRepository);
  }

  async findAllForUser(userId: number, filters: ListTransactionFiltersDto) {
    const { page, pageSize, take, skip } = getPaginationOptions(
      filters.pageSize,
      filters.page,
    );
    const { sort, sortOrder } = getSortOptions(filters.sort, filters.sortOrder);
    const { type, categoryIds, minAmount, maxAmount, startDate, endDate } =
      filters;

    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.user.id = :userId', { userId })
      .leftJoinAndSelect('transaction.category', 'category')
      .orderBy(`transaction.${sort}`, sortOrder)
      .take(take)
      .skip(skip);

    if (type) {
      query.andWhere('transaction.type = :type', { type });
    }

    if (categoryIds) {
      query.andWhere('transaction.category.id IN (:...categoryIds)', {
        categoryIds,
      });
    }

    if (minAmount) {
      query.andWhere('transaction.amount >= :minAmount', { minAmount });
    }

    if (maxAmount) {
      query.andWhere('transaction.amount <= :maxAmount', { maxAmount });
    }

    if (startDate) {
      query.andWhere('transaction.incurredAt >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('transaction.incurredAt <= :endDate', { endDate });
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
    const transaction = await this.transactionRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['category'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  async createForUser(
    userId: number,
    data: CreateTransactionDto,
  ): Promise<Transaction> {
    const { categoryId } = data;
    const category = await this.categoriesService.findOne({
      where: {
        id: categoryId,
        user: { id: userId },
      },
    });

    if (!category) {
      throw new BadRequestException('Invalid category ID');
    }

    const transaction = this.transactionRepository.create({
      ...data,
      category,
      user: { id: userId },
      createdBy: userId,
      updatedBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.transactionRepository.save(transaction);
  }

  async updateForUser(
    userId: number,
    id: number,
    data: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transaction = await this.findByIdForUser(userId, id);

    const updatingObject: Partial<Transaction> = {
      ...data,
      updatedBy: userId,
      updatedAt: new Date(),
    };

    if (data.categoryId) {
      const category = await this.categoriesService.findOne({
        where: {
          id: data.categoryId,
          user: { id: userId },
        },
      });

      if (!category) {
        throw new BadRequestException('Invalid category ID');
      }

      updatingObject.category = category;
    }

    const updatedTransaction = this.transactionRepository.merge(
      transaction,
      updatingObject,
    );

    return this.transactionRepository.save(updatedTransaction);
  }

  async deleteForUser(userId: number, id: number): Promise<void> {
    const transaction = await this.findByIdForUser(userId, id);
    const deletedTransaction = this.transactionRepository.merge(transaction, {
      deletedBy: userId,
    });
    await this.transactionRepository.softRemove(deletedTransaction);
  }
}
