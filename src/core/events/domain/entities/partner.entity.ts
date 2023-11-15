import Uuid from '../../../common/domain/value-objects/uuid.vo';
import { AggregateRoot } from '../../../common/domain/aggregate-root';
import { Event } from './event.entity';

export class PartnerId extends Uuid {}

export type ParnerConstructorProps = {
  id?: PartnerId | string;
  name: string;
};

export type InitEventCommand = {
  name: string;
  description?: string | null;
  date: Date;
};

export class Partner extends AggregateRoot {
  id: PartnerId;
  name: string;

  constructor(props: ParnerConstructorProps) {
    super();
    this.id =
      typeof props.id === 'string'
        ? new PartnerId(props.id)
        : props.id ?? new PartnerId();
    this.name = props.name;
  }

  static create(command: { name: string }) {
    return new Partner({
      name: command.name,
    });
  }

  initEvent(command: InitEventCommand) {
    return Event.create({
      ...command,
      partner_id: this.id,
    });
  }

  changeName(name: string) {
    this.name = name;
  }

  changeDescription(description: string | null) {
    this.name = description;
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
