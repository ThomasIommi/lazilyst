import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Message, MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

import { DialogComponent } from '../dialog-component';
import { FormService } from '../../../services/form.service';


@Component({
  selector: 'app-new-task-dialog',
  templateUrl: './new-task-dialog.component.html',
  styleUrls: ['./new-task-dialog.component.scss']
})
export class NewTaskDialogComponent extends DialogComponent implements OnInit {

  /** New task main FormGroup */
  taskForm: FormGroup;

  /** Validation errors */
  validationErrors: Message[] = [];

  /**
   * Constructor injection
   * @param dynamicDialogRef PrimeNG dialog reference to return value on dialog closure
   * @param formBuilder Angular reactive form builder
   * @param messageService PrimeNG service to add messages
   * @param translateService Service for handling translations by ngx-translate
   * @param formService Service with utilities related to forms
   */
  constructor(dynamicDialogRef: DynamicDialogRef,
              private formBuilder: FormBuilder,
              private messageService: MessageService,
              private translateService: TranslateService,
              private formService: FormService) {
    super(dynamicDialogRef);
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
      link: null
    });
  }

  /** Saves the task */
  saveTask(): void {
    this.taskForm.markAllAsTouched();
    if (this.taskForm.invalid) {
      this.validationErrors = this.formService.validationErrors(this.taskForm);
      return;
    }
    this.close(this.taskForm.value);
  }

  /** Resets the form */
  resetForm(): void {
    this.taskForm.reset();
    this.validationErrors.length = 0;
  }

}
