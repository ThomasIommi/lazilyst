import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Task } from '../../../shared/models/task';
import { TasksState } from '../../../state/tasks/tasks.state';


@Component({
  selector: 'app-task-infos',
  templateUrl: './task-infos.component.html',
  styleUrls: ['./task-infos.component.scss']
})
export class TaskInfosComponent implements OnInit {

  /** Current task observable from NGXS app state */
  @Select(TasksState.currentTask) currentTask$: Observable<Task>;

  /**
   * Constructor injection
   */
  constructor() {
  }

  /** Component main initialization */
  ngOnInit(): void {
  }

  /** Check if there is at least some info to display */
  thereIsInfo(task: Task): boolean {
    return task.description != null || task.link != null;
  }
}
