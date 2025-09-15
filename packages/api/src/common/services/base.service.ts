import {
  Repository,
  ObjectLiteral,
  DeepPartial,
  FindOptionsWhere,
} from 'typeorm';

export abstract class BaseService<T extends ObjectLiteral> {
  protected constructor(protected readonly repository: Repository<T>) {}

  // async findAll(
  //   options?: FindOptionsWhere<T> & { pageSize?: number; page?: number },
  // ): Promise<{
  //   data: T[];
  //   total: number;
  //   pageSize: number;
  //   page: number;
  //   pageCount: number;
  // }> {
  //   const [data, total] = await this.repository.findAndCount({
  //     where: options,
  //     take: options?.pageSize,
  //     skip: options?.page ? (options.page - 1) * (options.pageSize || 10) : 0,
  //   });

  //   return {
  //     data,
  //     total,
  //     pageSize: options?.pageSize || 10,
  //     page: options?.page || 1,
  //     pageCount: Math.ceil(total / (options?.pageSize || 10)),
  //   };
  // }

  findById(id: number): Promise<T | null> {
    return this.repository.findOneBy({ id } as unknown as FindOptionsWhere<T>);
  }

  findByIdOrFail(id: number): Promise<T> {
    return this.repository.findOneByOrFail({
      id,
    } as unknown as FindOptionsWhere<T>);
  }

  findOne(options: FindOptionsWhere<T>): Promise<T | null> {
    return this.repository.findOne(options);
  }

  findOneOrFail(options: FindOptionsWhere<T>): Promise<T> {
    return this.repository.findOneOrFail(options);
  }

  create(data: DeepPartial<T>): Promise<T> {
    console.log('>>', data);

    const entity = this.repository.create(data);

    return this.repository.save(entity);
  }

  async update(id: number, data: Partial<T>): Promise<T | null> {
    await this.repository.update(id, data);

    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.update(id, {
      deletedAt: new Date(),
    } as unknown as Partial<T>);
  }
}
