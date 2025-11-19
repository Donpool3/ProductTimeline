import { Repository, FindOptionsWhere, FindManyOptions, DeepPartial, ObjectLiteral } from 'typeorm';

export abstract class BaseRepository<T extends ObjectLiteral> {
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

  async findById(id: string, relations?: string[]): Promise<T | null> {
    return this.repository.findOne({
      where: { id } as any,
      relations,
    });
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T> {
    await this.repository.update(id, data as any);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Entity with id ${id} not found after update`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async count(where?: FindOptionsWhere<T>): Promise<number> {
    return this.repository.count({ where });
  }

  async exists(where: FindOptionsWhere<T>): Promise<boolean> {
    const count = await this.repository.count({ where });
    return count > 0;
  }

  async save(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  async saveMany(entities: T[]): Promise<T[]> {
    return this.repository.save(entities);
  }
}
