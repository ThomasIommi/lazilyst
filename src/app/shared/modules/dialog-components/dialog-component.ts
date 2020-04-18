import { DynamicDialogRef } from 'primeng/dynamicdialog';

/** Super class for all Dialog Components */
export class DialogComponent {

  constructor(protected dynamicDialogRef: DynamicDialogRef) {
  }

  /** Closing dialog with a value */
  protected close(value: any): void {
    this.dynamicDialogRef.close(value);
  }

  /** Dismissing dialog without a value */
  protected dismiss(): void {
    this.dynamicDialogRef.destroy();
  }
}
