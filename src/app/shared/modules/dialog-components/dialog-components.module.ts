import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';

import { LangSelectionDialogComponent } from './lang-selection-dialog/lang-selection-dialog.component';
import { NewTaskDialogComponent } from './new-task-dialog/new-task-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { EditTaskDialogComponent } from './edit-task-dialog/edit-task-dialog.component';
import { TaskFormModule } from '../task-form/task-form.module';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    ButtonModule,
    TaskFormModule
  ],
  declarations: [
    LangSelectionDialogComponent,
    NewTaskDialogComponent,
    ConfirmDialogComponent,
    EditTaskDialogComponent
  ]
})
export class DialogComponentsModule {
}
