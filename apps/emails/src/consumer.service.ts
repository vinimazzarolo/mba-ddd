import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConsumerService {
  @RabbitSubscribe({
    exchange: 'amq.direct',
    routingKey: 'PartnerCreatedIntegrationEvent',
    // routingKey: 'events.fullcycle.com/*',
    queue: 'emails',
  })
  handle(msg: { event_name: string; [key: string]: any }) {
    /*
    switch (msg.event_name) {
      case 'PartnerCreatedIntegrationEvent':
        console.log('ConsumerService.handle', msg);
        break;
      default:
        console.log('ConsumerService.handle', msg);
        break;
    }
    */
    console.log('ConsumerService.handle', msg);
  }
}
