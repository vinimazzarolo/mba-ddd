import { Type } from 'class-transformer';

export class EventDto {
  name: string;
  description: string;
  @Type(() => Date)
  date: Date;
  partnerId: string;
}
