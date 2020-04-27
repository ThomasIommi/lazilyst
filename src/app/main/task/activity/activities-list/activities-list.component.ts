import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';

import { Activity } from '../../../../shared/models/activity';
import { TasksState } from '../../../../state/tasks/tasks.state';


@Component({
  selector: 'app-activities-list',
  templateUrl: './activities-list.component.html',
  styleUrls: ['./activities-list.component.scss']
})
export class ActivitiesListComponent implements OnInit {

  /** Current task activities observable from NGXS app state */
  @Select(TasksState.currentTaskActivities) activities$: Observable<Activity[]>;

  /**
   * Constructor injection
   */
  constructor() { }

  /** Constructor main initialization */
  ngOnInit(): void {
  }

}
