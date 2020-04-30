import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { DialogComponent } from '../dialog-component';


@Component({
  selector: 'app-lang-selection-dialog',
  templateUrl: './lang-selection-dialog.component.html',
  styleUrls: ['./lang-selection-dialog.component.scss']
})
export class LangSelectionDialogComponent extends DialogComponent {

  /**
   * Constructor injection
   * @param dynamicDialogRef PrimeNG dialog reference to return value on dialog closure
   */
  constructor(dynamicDialogRef: DynamicDialogRef) {
    super(dynamicDialogRef);
  }

  /**
   * Language selection, closes the dialog with the selected lang
   * @param selectedLang Selected language
   */
  selectLang(selectedLang: string) {
    this.close(selectedLang);
  }

}
