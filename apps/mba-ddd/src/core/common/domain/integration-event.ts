export interface IIntegrationEvent {
  event_name: string;
  payload: any;
  event_version: number;
  occurred_on: Date;
}
