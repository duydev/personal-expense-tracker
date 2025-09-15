import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { CategoryType } from '../enums/category-types.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SortOrder } from '../../common/enums/sort-order.enum';

export class ListCategoryFiltersDto {
  @ApiPropertyOptional({
    description: 'Filter by category type (income or expense)',
    enum: CategoryType,
    example: CategoryType.EXPENSE,
  })
  @IsOptional()
  @IsEnum(CategoryType)
  type?: CategoryType;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page for pagination',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pageSize?: number;

  @ApiPropertyOptional({
    description: 'Sort by field (e.g., createdAt, name)',
    enum: ['createdAt', 'name'],
    example: 'createdAt',
  })
  @IsOptional()
  @IsEnum(['createdAt', 'name'])
  sort?: 'createdAt' | 'name';

  @ApiPropertyOptional({
    description: 'Sort order (ascending or descending)',
    enum: SortOrder,
    example: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;
}
