import { Type, Platform, EntityProperty } from '@mikro-orm/core';
import { EventSpotId } from '../../../domain/entities/event-spot';

export class EventSpotIdSchemaType extends Type<EventSpotId, string> {
  convertToDatabaseValue(
    valueObject: EventSpotId | undefined | null,
    platform: Platform,
  ): string {
    return valueObject instanceof EventSpotId
      ? valueObject.value
      : (valueObject as string);
  }

  convertToJSValue(value: string, platform: Platform): EventSpotId {
    return new EventSpotId(value);
  }

  getColumnType(props: EntityProperty, platform: Platform) {
    return 'varchar(36)';
  }
}
