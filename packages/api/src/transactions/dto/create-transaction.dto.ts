import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
} from 'class-validator';
import { TransactionType } from '../enums/transaction-types.enum';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  categoryId: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @Type(() => Date)
  incurredAt?: Date;
}
