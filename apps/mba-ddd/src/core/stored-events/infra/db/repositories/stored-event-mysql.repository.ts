import { EntityManager } from '@mikro-orm/mysql';
import { IStoredEventRepository } from '../../../domain/repositories/stored-event.repository';
import {
  StoredEvent,
  StoredEventId,
} from '../../../domain/entities/stored-event.entity';
import { IDomainEvent } from 'apps/mba-ddd/src/core/common/domain/domain-event';

export class StoredEventMysqlRepository implements IStoredEventRepository {
  constructor(private entityManager: EntityManager) {}

  allBetween(
    lowEventId: StoredEventId,
    highEventId: StoredEventId,
  ): Promise<StoredEvent[]> {
    return this.entityManager.find(StoredEvent, {
      id: { $gte: lowEventId, $lte: highEventId },
    });
  }

  allSince(eventId: StoredEventId): Promise<StoredEvent[]> {
    return this.entityManager.find(StoredEvent, { id: { $gte: eventId } });
  }

  add(domainEvent: IDomainEvent): StoredEvent {
    const storedEvent = StoredEvent.create(domainEvent);
    this.entityManager.persist(storedEvent);
    return storedEvent;
  }
}
