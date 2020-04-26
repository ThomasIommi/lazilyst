import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MessageService, SharedModule } from 'primeng/api';

import { LangSelectionDialogComponent } from './lang-selection-dialog/lang-selection-dialog.component';
import { NewTaskDialogComponent } from './new-task-dialog/new-task-dialog.component';
import { CommonDirectivesModule } from '../common-directives/common-directives.module';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    InputTextareaModule,
    InputTextModule,
    ButtonModule,
    MessagesModule,
    MessageModule,
    SharedModule,
    CommonDirectivesModule
  ],
  declarations: [
    LangSelectionDialogComponent,
    NewTaskDialogComponent,
    ConfirmDialogComponent
  ],
  providers: [
    MessageService
  ]
})
export class DialogComponentsModule {
}
