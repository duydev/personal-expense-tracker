import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { CategoryType } from '../enums/category-types.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SortOrder } from '../../common/enums/sort-order.enum';

export class ListCategoriesDto {
  @ApiPropertyOptional({
    description: 'Filter by category type (income or expense)',
    enum: CategoryType,
    example: 'expense',
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
    example: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional({
    description: 'Sort order (ascending or descending)',
    enum: SortOrder,
    example: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;
}
