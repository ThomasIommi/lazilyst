import { BaseEntity } from './base-entity';


export class Activity extends BaseEntity {
  /** Activity main description */
  description: string;

  /** Activity completed flag */
  done: boolean;
}
