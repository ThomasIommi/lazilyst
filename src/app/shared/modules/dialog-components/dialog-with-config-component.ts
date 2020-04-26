import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { DialogComponent } from './dialog-component';


/** Super class for all dialog components that require additional data/informations */
export class DialogWithConfigComponent extends DialogComponent {

  /**
   * Constructor injection
   * @param dynamicDialogRef PrimeNG dialog reference to return value on dialog closure
   * @param dynamicDialogConfig PrimeNG dynamic dialog configuration with with which it was opened
   */
  constructor(dynamicDialogRef: DynamicDialogRef, protected dynamicDialogConfig: DynamicDialogConfig) {
    super(dynamicDialogRef);
  }

  /** Gets custom data configuration from the opening method */
  protected getData(): any {
    return this.dynamicDialogConfig.data;
  }
}
