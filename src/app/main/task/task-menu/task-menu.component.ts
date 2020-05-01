import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';

import { CreateActivity } from '../../../state/tasks/tasks.actions';


@Component({
  selector: 'app-task-menu',
  templateUrl: './task-menu.component.html',
  styleUrls: ['./task-menu.component.scss']
})
export class TaskMenuComponent implements OnInit {

  /**
   * Construction injection
   * @param store NGXS app store
   */
  constructor(private store: Store) { }

  /** Component main initialization */
  ngOnInit(): void {
  }

  /** Adds an empty activity to the current task */
  addActivity(): void {
    this.store.dispatch(new CreateActivity());
  }
}
