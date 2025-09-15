import { IsOptional, IsInt, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTransactionDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  categoryId: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Date)
  incurredAt?: Date;
}
