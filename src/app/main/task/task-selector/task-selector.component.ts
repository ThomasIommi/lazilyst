import { Component, OnInit } from '@angular/core';
import { Task } from '../../../shared/models/task';

@Component({
  selector: 'app-task-selector',
  templateUrl: './task-selector.component.html',
  styleUrls: ['./task-selector.component.scss']
})
export class TaskSelectorComponent implements OnInit {
  /** Currently selected Task */
  currentSelectedTask: Task;
  /** Selectable Tasks */
  tasks: Task[] = [];

  constructor() { }

  /** TaskSelectorComponent initialization */
  ngOnInit(): void {
    // TODO load lists and get last used
    this.currentSelectedTask = new Task('test');
    for (let i = 0; i < 50; i++) {
      this.tasks.push(new Task('Task ' + (i + 1)));
    }
    this.tasks.push(new Task('Very very very very long description task'));
  }
}
