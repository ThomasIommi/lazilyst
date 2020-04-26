import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { v4 as randomUUID } from 'uuid';

import { BaseEntity } from '../models/base-entity';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  /**
   * Constructor injection
   * @param store NGXS app store
   */
  constructor(private store: Store) {
  }

  /**
   * Generates a random ID and checks that this generated ID differs from every other ID present
   * in the list of BaseEntity elements passed as an argument
   * @param elements Elements where to check if generated ID is already used
   */
  getUniqueId(elements: BaseEntity[]): string {
    let candidateId: string;
    let idUsed: boolean;
    do {
      candidateId = randomUUID();
      const entity: BaseEntity = elements.find((element: BaseEntity) => {
        return element._id === candidateId;
      });
      idUsed = entity != null;
    } while (idUsed);
    return candidateId;
  }


}

