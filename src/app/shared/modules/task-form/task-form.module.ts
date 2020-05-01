import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessagesModule } from 'primeng/messages';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';

import { TaskFormComponent } from './task-form.component';
import { CommonDirectivesModule } from '../common-directives/common-directives.module';


@NgModule({
  declarations: [TaskFormComponent],
  exports: [
    TaskFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MessagesModule,
    InputTextareaModule,
    TranslateModule,
    ButtonModule,
    InputTextModule,
    CommonDirectivesModule
  ],
  providers: [
    MessageService
  ]
})
export class TaskFormModule {
}
