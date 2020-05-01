import { Component, ElementRef, EventEmitter, forwardRef, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';

import { animate } from '../../../../shared/functions/animate.functions';
import { AnimationSpeeds } from '../../../../shared/models/animation-speed';
import { Activity } from '../../../../shared/models/activity';
import * as deepmerge from 'deepmerge';


@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ActivityComponent),
      multi: true
    }
  ]
})
export class ActivityComponent implements ControlValueAccessor {

  /** Reference to activity main container to handle animations */
  @ViewChild('activityContainer') activityContainer: ElementRef;

  /** Reference to activity textarea */
  @ViewChild('textAreaElement', {static: true}) textAreaElement: ElementRef;

  /** Reference to activity checkbox */
  @ViewChild('activityCheckbox', {static: true}) activityCheckbox: Checkbox;

  /** Event emitter to notify the necessity to create a new activity */
  @Output() createActivity: EventEmitter<void> = new EventEmitter<void>();

  /** Event emitter to notify the necessity to delete this activity */
  @Output() deleteActivity: EventEmitter<void> = new EventEmitter<void>();

  /** Function to call when the value associated with the widget changes */
  onChange: any = () => {
  }

  /** Function to call when the focus is released */
  onTouch: any = () => {
  }

  /**
   * Saves the default Angular handler for the onChange() function, manages the update of the form binding
   * and the ng-dirty / ng-pristine flag
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /** Saves the default Angular handler for the onTouch() function, manages the flag ng-touched / ng-untouched */
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  /** Manages the FormControl disabled flag */
  setDisabledState(isDisabled: boolean): void {
    this.textAreaElement.nativeElement.disabled = isDisabled;
  }

  /** Manages the dynamic update of the form value */
  writeValue(activity: Activity): void {
    if (activity != null) {
      this.activityCheckbox.writeValue(!!activity.done);
      this.textAreaElement.nativeElement.value = activity.description != null ? activity.description : '';
    } else {
      this.activityCheckbox.writeValue(false);
      this.textAreaElement.nativeElement.value = '';
    }
  }

  /** Activity onChange handling */
  handleChange(): void {
    const description = this.textAreaElement.nativeElement.value;
    const done = this.activityCheckbox.isChecked();
    this.onChange({description, done} as Activity);
  }

  /**
   * Set focus to the activity text input
   */
  focus(): void {
    this.textAreaElement.nativeElement.focus();
  }

  /**
   * Sends parent component an event to create a new activity
   * @param event KeyboardEvent <em>keydown.enter</em>
   */
  onEnter(event: KeyboardEvent): void {
    event.preventDefault();
    this.createActivity.emit();
  }

  /**
   * Sends parent component an event to delelte the activity
   * @param event KeyboardEvent <em>keydown.alt.delete</em>
   */
  async onAltDelete(event: KeyboardEvent): Promise<void> {
    event.preventDefault();
    this.deleteActivity.emit();
  }

  // TODO jsDoc
  onShiftEnter(event: KeyboardEvent): void {
    event.preventDefault();
    // TODO open activity options
  }

  animateIn(): Promise<void> {
    return animate(this.activityContainer, 'bounceIn', AnimationSpeeds.FAST);
  }

  animateOut(): Promise<void> {
    return animate(this.activityContainer, 'bounceOut', AnimationSpeeds.FASTER);
  }


}
