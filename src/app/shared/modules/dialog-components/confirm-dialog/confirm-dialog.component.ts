import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { DialogWithConfigComponent } from '../dialog-with-config-component';
import { ConfirmDialogData } from './confirm-dialog-data';


@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent extends DialogWithConfigComponent implements OnInit {

  /** Default confirm dialog data */
  confirmDialogData: ConfirmDialogData = {
    content: 'i18n.term.confirm_action',
    buttonOkLabel: 'i18n.term.ok',
    buttonNoLabel: 'i18n.term.no'
  } as ConfirmDialogData;

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
    this.confirmDialogData = Object.assign(this.confirmDialogData, this.getData());
  }

  /** Confirms the operation returning true */
  confirm(): void {
    this.close(true);
  }

  /** Cancel the operation dismissing the dialog */
  cancel(): void {
    this.close(false);
  }
}
