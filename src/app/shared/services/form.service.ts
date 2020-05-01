import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Message } from 'primeng/api';


@Injectable({
  providedIn: 'root'
})
export class FormService {

  /**
   * Constructor injection
   * @param translateService Service for handling translations by ngx-translate
   */
  constructor(private translateService: TranslateService) {
  }

  /**
   * Recursive function that loops through all form controls in search of errors and returns a list of PrimeNg messages
   * to be displayed as validation result
   * @param formControl Angular form control (root)
   * @param key Field key
   */
  validationErrors(formControl: AbstractControl, key?: string): Message[] {
    const messages: Message[] = [];
    messages.push(...this.extractErrorMessages(formControl, key));
    if (formControl instanceof FormArray) {
      formControl.controls.forEach((innerControl: AbstractControl) => {
        messages.push(...this.validationErrors(innerControl));
      });
    } else if (formControl instanceof FormGroup) {
      Object.keys(formControl.controls).forEach((formControlKey: string) => {
        messages.push(...this.validationErrors(formControl.get(formControlKey), formControlKey));
      });
    }
    return messages;
  }

  /**
   * Extract all errors in a form control and returns a list of comprehensive PrimeNg messages
   * @param formControl Form control to check
   * @param key Form control key/name
   */
  private extractErrorMessages(formControl: AbstractControl, key?: string): Message[] {
    const messages: Message[] = [];
    if (formControl.errors != null) {
      Object.keys(formControl.errors).forEach(error => {
        switch (error) {
          // add other possible validation errors in this switch
          case 'required':
            messages.push({
              severity: 'error',
              summary: this.translateService.instant('i18n.term.required_field'),
              detail: this.translateService.instant('i18n.field.' + key)
            } as Message);
            break;
        }
      });
    }
    return messages;
  }


}
