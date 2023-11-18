import { Type, Platform, EntityProperty } from '@mikro-orm/core';
import Cpf from '../../../../common/domain/value-objects/cpf.vo';

export class CpfSchemaType extends Type<Cpf, string> {
  convertToDatabaseValue(
    valueObject: Cpf | undefined | null,
    platform: Platform,
  ): string {
    return valueObject instanceof Cpf
      ? valueObject.value
      : (valueObject as string);
  }

  convertToJSValue(value: string, platform: Platform): Cpf {
    return new Cpf(value);
  }

  getColumnType(props: EntityProperty, platform: Platform) {
    return 'varchar(11)';
  }
}
