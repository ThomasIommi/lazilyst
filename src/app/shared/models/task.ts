import { BaseEntity } from './base-entity';
import { Activity } from './activity';


export class Task extends BaseEntity {
  /** Task name */
  name: string;
  /** Task Description */
  description: string;
  /** Task external link */
  link: string;
  /** Task activities */
  activities: Activity[] = [];

  /** Basic costructor */
  constructor() {
    super();
  }

}
