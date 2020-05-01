import { Directive, HostListener, OnChanges } from '@angular/core';
import { NgControl } from '@angular/forms';


/**
 * A directive to remove empty or blank strings from a form control on value change
 */
@Directive({
  selector: '[appNoBlank]'
})
export class NoBlankDirective implements OnChanges {

  /**
   * Constructor injection
   * @param ngControl Angular form control reference
   */
  constructor(private ngControl: NgControl) {
  }

  /**
   * Listens for input value changes, trims the new value
   * and if the new value is empty it resets the form control value to null
   */
  @HostListener('change') ngOnChanges(): void {
    if (this.ngControl.value != null && (typeof this.ngControl.value === 'string')) {
      const newValue = this.ngControl.value.trim();
      this.ngControl.control.setValue(newValue.length > 0 ? newValue : null);
    }
  }




}
