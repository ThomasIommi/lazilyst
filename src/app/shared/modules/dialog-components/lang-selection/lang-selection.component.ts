import { Component, OnInit } from '@angular/core';
import { DialogComponent } from '../dialog-component';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-lang-selection',
  templateUrl: './lang-selection.component.html',
  styleUrls: ['./lang-selection.component.scss']
})
export class LangSelectionComponent extends DialogComponent implements OnInit {

  constructor(dynamicDialogRef: DynamicDialogRef) {
    super(dynamicDialogRef);
  }

  ngOnInit(): void {
  }

  /**
   * Language selection, close the dialog with the selected lang
   * @param selectedLang Selected language
   */
  selectLang(selectedLang: string) {
    this.close(selectedLang);
  }

}
