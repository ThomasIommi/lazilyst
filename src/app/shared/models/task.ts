import { BaseEntity } from './base-entity';


export class Task extends BaseEntity {
  /** Task name */
  name: string;
  /** Task Description */
  description: string;
  /** Task external link */
  link: string;

  /** Basic costructor */
  constructor(name: string) {
    super();
    this.name = name;
  }

}
