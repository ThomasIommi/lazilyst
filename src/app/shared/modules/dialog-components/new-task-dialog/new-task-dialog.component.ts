import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { DialogComponent } from '../dialog-component';
import { Task } from 'src/app/shared/models/task';


@Component({
  selector: 'app-new-task-dialog',
  templateUrl: './new-task-dialog.component.html',
  styleUrls: ['./new-task-dialog.component.scss']
})
export class NewTaskDialogComponent extends DialogComponent {

  /**
   * Constructor injection
   * @param dynamicDialogRef PrimeNG dialog reference to return value on dialog closure
   */
  constructor(dynamicDialogRef: DynamicDialogRef) {
    super(dynamicDialogRef);
  }

  /** Saves the task */
  saveTask(task: Task): void {
    this.close(task);
  }
}
