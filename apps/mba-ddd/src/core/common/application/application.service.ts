import { DomainEventManager } from '../domain/domain-event-manger';
import { IUnitOfWork } from './unit-of-work.interface';

export class ApplicationService {
  constructor(
    private uow: IUnitOfWork,
    private domainEventManager: DomainEventManager,
  ) {}

  start() {}

  async finish() {
    const aggregateRoots = this.uow.getAggregateRoots();
    await this.uow.commit();
    for (const aggregateRoot of aggregateRoots) {
      await this.domainEventManager.publish(aggregateRoot);
    }
  }

  fail() {}

  async run<T>(callback: () => Promise<T>): Promise<T> {
    await this.start();
    try {
      const result = await callback();
      await this.finish();
      return result;
    } catch (error) {
      await this.fail();
      throw error;
    }
  }
}
