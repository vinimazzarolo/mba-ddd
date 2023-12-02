import { Global, Module } from '@nestjs/common';
import { DomainEventManager } from '../core/common/domain/domain-event-manger';

@Global()
@Module({
  providers: [DomainEventManager],
  exports: [DomainEventManager],
})
export class DomainEventsModule {}
