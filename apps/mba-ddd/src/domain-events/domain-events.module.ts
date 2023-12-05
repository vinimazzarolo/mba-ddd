import { MikroOrmModule } from '@mikro-orm/nestjs';
import { StoredEventSchema } from '../core/stored-events/infra/db/schemas';
import { DomainEventManager } from '../core/common/domain/domain-event-manger';
import { IntegrationEventsPublisher } from './integration-events.publisher';
import { StoredEventMysqlRepository } from '../core/stored-events/infra/db/repositories/stored-event-mysql.repository';
import { EntityManager } from '@mikro-orm/mysql';
import { Global, Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { IDomainEvent } from '../core/common/domain/domain-event';

@Global()
@Module({
  imports: [MikroOrmModule.forFeature([StoredEventSchema])],
  providers: [
    DomainEventManager,
    IntegrationEventsPublisher,
    {
      provide: 'IStoredEventRepository',
      useFactory: (em) => new StoredEventMysqlRepository(em),
      inject: [EntityManager],
    },
  ],
  exports: [DomainEventManager],
})
export class DomainEventsModule implements OnModuleInit {
  constructor(
    private readonly domainEventManager: DomainEventManager,
    private moduleRef: ModuleRef,
  ) {}

  onModuleInit() {
    this.domainEventManager.register('*', async (event: IDomainEvent) => {
      const repo = await this.moduleRef.resolve('IStoredEventRepository');
      console.log('--------------------------');
      console.log(event);
      await repo.add(event);
    });
  }
}
