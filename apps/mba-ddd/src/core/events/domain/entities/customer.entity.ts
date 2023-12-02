import Cpf from '../../../common/domain/value-objects/cpf.vo';
import { AggregateRoot } from '../../../common/domain/aggregate-root';
import Uuid from '../../../common/domain/value-objects/uuid.vo';

export class CustomerId extends Uuid {}

export type CustomerConstructorProps = {
  id?: CustomerId | string;
  cpf: Cpf;
  name: string;
};

export class Customer extends AggregateRoot {
  id: CustomerId;
  cpf: Cpf;
  name: string;

  constructor(props: CustomerConstructorProps) {
    super();
    this.id =
      typeof props.id === 'string'
        ? new CustomerId(props.id)
        : props.id ?? new CustomerId();
    this.cpf = props.cpf;
    this.name = props.name;
  }

  changeName(name: string) {
    this.name = name;
  }

  static create(command: { name: string; cpf: string }) {
    return new Customer({
      name: command.name,
      cpf: new Cpf(command.cpf),
    });
  }

  toJson() {
    return {
      id: this.id.value,
      name: this.name,
      cpf: this.cpf.value,
    };
  }
}
