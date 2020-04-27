import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message, MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

import { FormService } from '../../services/form.service';
import { Task } from '../../models/task';


@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {

  /** Event emitter to notify the saving of the task */
  @Output() taskSaved: EventEmitter<Task> = new EventEmitter<Task>();

  /** Input / property binding to bind the task to update to the form */
  @Input() updateTask: Task;

  /** New task main FormGroup */
  taskForm: FormGroup;

  /** Validation errors */
  validationErrors: Message[] = [];

  /**
   * Constructor injection
   * @param formBuilder Angular reactive form builder
   * @param messageService PrimeNG service to add messages
   * @param translateService Service for handling translations by ngx-translate
   * @param formService Service with utilities related to forms
   */
  constructor(private formBuilder: FormBuilder,
              private messageService: MessageService,
              private translateService: TranslateService,
              private formService: FormService) {
  }

  /** Component main initialization */
  ngOnInit(): void {
    this.initForm();
  }

  /** Form initialization */
  private initForm(): void {
    this.taskForm = this.formBuilder.group({
      name: [null, Validators.required],
      description: null,
      link: null,
    });
    if (this.updateTask != null) {
      this.taskForm.patchValue(this.updateTask);
    }
  }

  /** Saves the task */
  saveTask(): void {
    this.taskForm.markAllAsTouched();
    if (this.taskForm.invalid) {
      this.validationErrors = this.formService.validationErrors(this.taskForm);
      return;
    }
    this.taskSaved.emit(this.taskForm.value);
  }

  /** Resets the form */
  resetForm(): void {
    this.taskForm.reset(this.updateTask);
    this.validationErrors.length = 0;
  }

}
