import { BaseEntity } from './base-entity';


export class Activity extends BaseEntity {
  /** Main description */
  description: string;

  /** Done activity flag */
  done: boolean;
}
