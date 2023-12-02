import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, OnModuleInit } from '@nestjs/common';
import {
  CustomerSchema,
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  OrderSchema,
  PartnerSchema,
  SpotReservationSchema,
} from '../core/events/infra/db/schemas';
import { PartnerMysqlRepository } from '../core/events/infra/db/repositories/partner-mysql.repository';
import { EntityManager } from '@mikro-orm/mysql';
import { CustomerMysqlRepository } from '../core/events/infra/db/repositories/customer-mysql.repository';
import { EventMysqlRepository } from '../core/events/infra/db/repositories/event-mysql.repository';
import { OrderMysqlRepository } from '../core/events/infra/db/repositories/order-mysql.repository';
import { PartnerService } from '../core/events/application/partner.service';
import { CustomerService } from '../core/events/application/customer.service';
import { EventService } from '../core/events/application/event.service';
import { PaymentGateway } from '../core/events/application/payment.gateway';
import { OrderService } from '../core/events/application/order.service';
import { IPartnerRepository } from '../core/events/domain/repositories/partner-repository.interface';
import { IUnitOfWork } from '../core/common/application/unit-of-work.interface';
import { ICustomerRepository } from '../core/events/domain/repositories/customer-repository.interface';
import { IEventRepository } from '../core/events/domain/repositories/event-repository.interface';
import { IOrderRepository } from '../core/events/domain/repositories/order-repository.interface';
import { ISpotReservationRepository } from '../core/events/domain/repositories/spot-reservation-repository.interface';
import { PartnersController } from './partners/partners.controller';
import { CustomersController } from './customers/customers.controller';
import { EventsController } from './events/events.controller';
import { EventSectionsController } from './events/event-sections.controller';
import { EventSpotsController } from './events/event-spots.controller';
import { ApplicationModule } from '../application/application.module';
import { ApplicationService } from '../core/common/application/application.service';
import { DomainEventManager } from '../core/common/domain/domain-event-manger';
import { PartnerCreated } from '../core/events/domain/domain-events/partner-created.event';
import { MyHandlerHandler } from '../core/events/application/handlers/my-handler.handler';
import { ModuleRef } from '@nestjs/core';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [
        CustomerSchema,
        PartnerSchema,
        EventSchema,
        EventSectionSchema,
        EventSpotSchema,
        OrderSchema,
        SpotReservationSchema,
      ],
    }),
    ApplicationModule,
  ],
  providers: [
    {
      provide: 'IPartnerRepository',
      useFactory: (em: EntityManager) => new PartnerMysqlRepository(em),
      inject: [EntityManager],
    },
    {
      provide: 'ICustomerRepository',
      useFactory: (em: EntityManager) => new CustomerMysqlRepository(em),
      inject: [EntityManager],
    },
    {
      provide: 'IEventRepository',
      useFactory: (em: EntityManager) => new EventMysqlRepository(em),
      inject: [EntityManager],
    },
    {
      provide: 'IOderRepository',
      useFactory: (em: EntityManager) => new OrderMysqlRepository(em),
      inject: [EntityManager],
    },
    {
      provide: 'ISpotReservationRepository',
      useFactory: (em: EntityManager) => new OrderMysqlRepository(em),
      inject: [EntityManager],
    },
    {
      provide: PartnerService,
      useFactory: (
        partnerRepo: IPartnerRepository,
        appService: ApplicationService,
      ) => new PartnerService(partnerRepo, appService),
      inject: ['IPartnerRepository', ApplicationService],
    },
    {
      provide: CustomerService,
      useFactory: (customerRepo: ICustomerRepository, uow: IUnitOfWork) =>
        new CustomerService(customerRepo, uow),
      inject: ['ICustomerRepository', 'IUnitOfWork'],
    },
    {
      provide: EventService,
      useFactory: (
        eventRepo: IEventRepository,
        partnerRepo: IPartnerRepository,
        uow: IUnitOfWork,
      ) => new EventService(eventRepo, partnerRepo, uow),
      inject: ['IEventRepository', 'IPartnerRepository', 'IUnitOfWork'],
    },
    PaymentGateway,
    {
      provide: OrderService,
      useFactory: (
        orderRepo: IOrderRepository,
        customerRepo: ICustomerRepository,
        spotReservationRepo: ISpotReservationRepository,
        eventRepo: IEventRepository,
        uow: IUnitOfWork,
        paymentGateway: PaymentGateway,
      ) =>
        new OrderService(
          orderRepo,
          customerRepo,
          spotReservationRepo,
          eventRepo,
          uow,
          paymentGateway,
        ),
      inject: [
        'IOderRepository',
        'ICustomerRepository',
        'ISpotReservationRepository',
        'IEventRepository',
        'IUnitOfWork',
        PaymentGateway,
      ],
    },
    {
      provide: MyHandlerHandler,
      useFactory: (
        partnerRepo: IPartnerRepository,
        domainEventManager: DomainEventManager,
      ) => new MyHandlerHandler(partnerRepo, domainEventManager),
      inject: ['IPartnerRepository', DomainEventManager],
    },
  ],
  controllers: [
    PartnersController,
    CustomersController,
    EventsController,
    EventSectionsController,
    EventSpotsController,
  ],
})
export class EventsModule implements OnModuleInit {
  constructor(
    private readonly domainEventManager: DomainEventManager,
    private moduleRef: ModuleRef,
  ) {}

  onModuleInit() {
    console.log('EventsModule initialized');
    MyHandlerHandler.listensTo().forEach((eventName: string) => {
      this.domainEventManager.register(eventName, async (event) => {
        const handler: MyHandlerHandler =
          await this.moduleRef.resolve(MyHandlerHandler);
        await handler.handle(event);
      });
    });
  }
}
