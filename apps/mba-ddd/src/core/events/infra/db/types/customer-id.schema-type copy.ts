import { Type, Platform, EntityProperty } from '@mikro-orm/core';
import { CustomerId } from '../../../domain/entities/customer.entity';

export class CustomerIdSchemaType extends Type<CustomerId, string> {
  convertToDatabaseValue(
    valueObject: CustomerId | undefined | null,
    platform: Platform,
  ): string {
    return valueObject instanceof CustomerId
      ? valueObject.value
      : (valueObject as string);
  }

  convertToJSValue(value: string, platform: Platform): CustomerId {
    return new CustomerId(value);
  }

  getColumnType(props: EntityProperty, platform: Platform) {
    return 'varchar(36)';
  }
}
