import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CategoryType } from '../enums/category-types.enum';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsEnum(CategoryType)
  type: CategoryType;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
