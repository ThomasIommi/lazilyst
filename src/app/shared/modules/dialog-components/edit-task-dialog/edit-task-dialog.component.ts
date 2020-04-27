import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { Task } from '../../../models/task';
import { DialogWithConfigComponent } from '../dialog-with-config-component';


@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  styleUrls: ['./edit-task-dialog.component.scss']
})
export class EditTaskDialogComponent extends DialogWithConfigComponent implements OnInit {

  /** Task to update */
  updateTask: Task;

  /**
   * Constructor injection
   * @param dynamicDialogRef PrimeNG dialog reference to return value on dialog closure
   * @param dynamicDialogConfig PrimeNG dynamic dialog configuration with with which it was opened
   */
  constructor(dynamicDialogRef: DynamicDialogRef, dynamicDialogConfig: DynamicDialogConfig) {
    super(dynamicDialogRef, dynamicDialogConfig);
  }

  /** Component main initialization */
  ngOnInit(): void {
    this.updateTask = this.getData();
    if (this.updateTask == null || this.updateTask._id == null) {
      this.dismiss();
      throw new Error('EditTaskDialogComponent.ngOnInit(): updateTask is invalid!');
    }
  }

  /** Saves the task */
  saveTask(task: Task): void {
    this.close(task);
  }

}
