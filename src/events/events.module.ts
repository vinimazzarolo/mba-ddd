import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
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
      useFactory: (partnerRepo: IPartnerRepository, uow: IUnitOfWork) =>
        new PartnerService(partnerRepo, uow),
      inject: ['IPartnerRepository', 'IUnitOfWork'],
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
  ],
  controllers: [
    PartnersController,
    CustomersController,
    EventsController,
    EventSectionsController,
    EventSpotsController,
  ],
})
export class EventsModule {}
