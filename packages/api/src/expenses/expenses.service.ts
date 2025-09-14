import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { BaseService } from 'src/common/services/base.service';

@Injectable()
export class ExpensesService extends BaseService<Expense> {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {
    super(expenseRepository);
  }
}
