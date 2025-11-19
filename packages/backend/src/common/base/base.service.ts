import { Repository, FindOptionsWhere, FindManyOptions, DeepPartial, ObjectLiteral } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

export abstract class BaseService<T extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<T>) {}

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async findOne(
    where: FindOptionsWhere<T>,
    relations?: string[],
  ): Promise<T | null> {
    return this.repository.findOne({
      where,
      relations,
    });
  }

  async findOneOrFail(
    where: FindOptionsWhere<T>,
    relations?: string[],
  ): Promise<T> {
    const entity = await this.findOne(where, relations);
    if (!entity) {
      throw new NotFoundException(
        `${this.repository.metadata.name} not found`,
      );
    }
    return entity;
  }

  async findById(id: string, relations?: string[]): Promise<T | null> {
    return this.repository.findOne({
      where: { id } as any,
      relations,
    });
  }

  async findByIdOrFail(id: string, relations?: string[]): Promise<T> {
    const entity = await this.findById(id, relations);
    if (!entity) {
      throw new NotFoundException(
        `${this.repository.metadata.name} with id ${id} not found`,
      );
    }
    return entity;
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T> {
    await this.findByIdOrFail(id);
    await this.repository.update(id, data as any);
    return this.findByIdOrFail(id);
  }

  async delete(id: string): Promise<void> {
    const entity = await this.findByIdOrFail(id);
    await this.repository.remove(entity);
  }

  async count(where?: FindOptionsWhere<T>): Promise<number> {
    return this.repository.count({ where });
  }

  async exists(where: FindOptionsWhere<T>): Promise<boolean> {
    const count = await this.repository.count({ where });
    return count > 0;
  }
}
