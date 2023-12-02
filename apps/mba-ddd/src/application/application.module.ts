import { Module } from '@nestjs/common';
import { ApplicationService } from '../core/common/application/application.service';
import { DomainEventManager } from '../core/common/domain/domain-event-manger';
import { IUnitOfWork } from '../core/common/application/unit-of-work.interface';

@Module({
  providers: [
    {
      provide: ApplicationService,
      useFactory: (uow: IUnitOfWork, domainEventManger: DomainEventManager) => {
        return new ApplicationService(uow, domainEventManger);
      },
      inject: ['IUnitOfWork', DomainEventManager],
    },
  ],
  exports: [ApplicationService],
})
export class ApplicationModule {}
