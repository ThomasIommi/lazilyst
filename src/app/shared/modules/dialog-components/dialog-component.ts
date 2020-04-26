import { DynamicDialogRef } from 'primeng/dynamicdialog';


/** Super class for all dialog components */
export class DialogComponent {

  /**
   * Constructor injection
   * @param dynamicDialogRef PrimeNG dialog reference to return value on dialog closure
   */
  constructor(protected dynamicDialogRef: DynamicDialogRef) {
  }

  /** Closes dialog with a value */
  protected close(value: any): void {
    this.dynamicDialogRef.close(value);
  }

  /** Dismisses dialog without a value */
  protected dismiss(): void {
    this.dynamicDialogRef.destroy();
  }
}
