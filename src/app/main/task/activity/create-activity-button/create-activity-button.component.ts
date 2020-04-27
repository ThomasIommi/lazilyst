import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';

import { CreateActivity } from '../../../../state/tasks/tasks.actions';


@Component({
  selector: 'app-create-activity-button',
  templateUrl: './create-activity-button.component.html',
  styleUrls: ['./create-activity-button.component.scss']
})
export class CreateActivityButtonComponent implements OnInit {

  /**
   * Construction injection
   * @param store NGXS app store
   */
  constructor(private store: Store) { }

  /** Component main initialization */
  ngOnInit(): void {
  }

  /** Adds an empty activity to the current task */
  addActivity() {
    this.store.dispatch(new CreateActivity());
  }
}
