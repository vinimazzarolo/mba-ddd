import { IDomainEventHandler } from '../../../common/application/domain-event-handler.interface';
import { DomainEventManager } from '../../../common/domain/domain-event-manger';
import { PartnerCreated } from '../../domain/domain-events/partner-created.event';
import { IPartnerRepository } from '../../domain/repositories/partner-repository.interface';

export class MyHandlerHandler implements IDomainEventHandler {
  constructor(
    private parnterRepo: IPartnerRepository,
    private domainEventManger: DomainEventManager,
  ) {}

  async handle(event: PartnerCreated): Promise<void> {
    console.log(event);
    // manipular agregados
    // this.partnerRepo.add()
    // this.domainEventManger.publish(aggregate);
  }

  static listensTo(): string[] {
    return [PartnerCreated.name];
  }
}
