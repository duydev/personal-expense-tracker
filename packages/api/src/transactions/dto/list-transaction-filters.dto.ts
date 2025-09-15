import { SortOrder } from 'src/common/enums/sort-order.enum';
import { TransactionType } from '../enums/transaction-types.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ListTransactionFiltersDto {
  @ApiPropertyOptional({
    description: 'Filter by transaction type (income or expense)',
    enum: TransactionType,
    example: TransactionType.EXPENSE,
  })
  @IsEnum(TransactionType)
  @IsOptional()
  type: TransactionType;

  @ApiPropertyOptional({
    description: 'Filter by category IDs',
    example: [1, 2, 3],
  })
  @IsInt({ each: true })
  @Type(() => Number)
  @IsOptional()
  categoryIds: number[];

  @ApiPropertyOptional({
    description: 'Filter by minimum amount',
    example: 100,
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  minAmount: number;

  @ApiPropertyOptional({
    description: 'Filter by maximum amount',
    example: 1000,
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  maxAmount: number;

  @ApiPropertyOptional({
    description: 'Filter by start date',
    example: '2022-01-01',
  })
  @Type(() => Date)
  @IsOptional()
  startDate: Date;

  @ApiPropertyOptional({
    description: 'Filter by end date',
    example: '2022-12-31',
  })
  @Type(() => Date)
  @IsOptional()
  endDate: Date;

  @ApiPropertyOptional({
    description: 'Page size',
    example: 10,
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  pageSize: number;

  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  page: number;

  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: ['incurredAt', 'amount', 'createdAt'],
    example: 'incurredAt',
  })
  @IsEnum(['incurredAt', 'amount', 'createdAt'])
  @IsOptional()
  sort: 'incurredAt' | 'amount' | 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: SortOrder,
    example: SortOrder.DESC,
  })
  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder: SortOrder;
}
