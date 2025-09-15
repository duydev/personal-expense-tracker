import { TransactionsService } from './transactions.service';
import { ListTransactionFiltersDto } from './dto/list-transaction-filters.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

@Controller('transactions')
@ApiBearerAuth()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of transactions.',
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
  findAll(@GetUser() user: User, @Query() params: ListTransactionFiltersDto) {
    return this.transactionsService.findAllForUser(user.id, params);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The transaction has been found.',
    example: {
      id: 1,
      name: 'Food',
      description: 'Expenses for food and groceries',
      createdAt: '2023-10-01T12:00:00Z',
      updatedAt: '2023-10-01T12:00:00Z',
    },
  })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  findOne(@GetUser() user: User, @Param('id') id: string) {
    return this.transactionsService.findByIdForUser(user.id, +id);
  }

  @Post()
  @ApiBody({
    type: CreateTransactionDto,
    examples: {
      example1: {
        summary: 'Basic Example',
        value: {
          type: 'expense',
          categoryId: 1,
          amount: 100,
          description: 'Expenses for food and groceries',
          incurredAt: '2023-10-01T12:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The transaction has been created.',
    example: {
      id: 3,
      name: 'Utilities',
      description: 'Expenses for utilities like electricity and water',
      createdAt: '2023-10-01T12:00:00Z',
      updatedAt: '2023-10-01T12:00:00Z',
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@GetUser() user: User, @Body() dto: CreateTransactionDto) {
    return this.transactionsService.createForUser(user.id, dto);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'The transaction has been updated.',
    example: {
      id: 1,
      name: 'Updated Category Name',
      description: 'Updated description for the category',
      createdAt: '2023-10-01T12:00:00Z',
      updatedAt: '2023-10-02T12:00:00Z',
    },
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  update(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.transactionsService.updateForUser(user.id, +id, dto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The transaction has been deleted.',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  delete(@GetUser() user: User, @Param('id') id: string) {
    return this.transactionsService.deleteForUser(user.id, +id);
  }
}
