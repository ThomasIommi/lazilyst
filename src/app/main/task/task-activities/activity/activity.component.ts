import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Store } from '@ngxs/store';

import { animate } from '../../../../shared/functions/animate.functions';
import { AnimationSpeeds } from '../../../../shared/models/animation-models';
import { CreateActivity, DeleteActivity, UpdateActivity } from '../../../../state/tasks/tasks.actions';
import { Activity } from '../../../../shared/models/activity';


@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent implements OnInit, AfterViewInit, OnDestroy {

  /** Reference to activity main container to handle animations */
  @ViewChild('activityContainer') activityContainer: ElementRef;

  /** Reference to activity textarea */
  @ViewChild('textAreaElement', {static: true}) textAreaElement: ElementRef;

  /** Reference to activity checkbox */
  @ViewChild('activityCheckbox', {static: true}) activityCheckbox: Checkbox;

  @Input() activity: Activity;

  /** Activity index in the list of activities */
  @Input() index: number;

  /** Flag to temporarely disable autoresize, needed for drag and drop optimization */
  @Input() autoresize: boolean;

  /** Activity main FormGroup */
  activityForm: FormGroup;

  /** Destroy subscription signal */
  private onDestroySubject: Subject<boolean> = new Subject<boolean>();

  /** Update state debouncer */
  private onUpdateDebouncerSubject: Subject<UpdateActivity> = new Subject<UpdateActivity>();

  /**
   * Constructor injection
   * @param formBuilder Angular reactive form builder
   * @param store NGXS app store
   */
  constructor(private formBuilder: FormBuilder,
              private store: Store) {
  }

  /** Component main initialization */
  ngOnInit(): void {
    this.initForm();
    this.initUpdateActivityDebouncer();
  }

  /** Initialization after the view is ready */
  ngAfterViewInit(): void {
    this.animateIn();
  }

  /** Cleanup before component destruction */
  ngOnDestroy(): void {
    this.onDestroySubject.next(true);
    this.onDestroySubject.unsubscribe();
  }

  /** Initializes the activity inner form */
  private initForm(): void {
    this.activityForm = this.formBuilder.group({
      done: false,
      description: null
    });
    this.activityForm.patchValue(this.activity);
  }

  /** Executes a subscription to apply a debouncer to the UpdateActivity actions */
  private initUpdateActivityDebouncer(): void {
    this.onUpdateDebouncerSubject.pipe(
      takeUntil(this.onDestroySubject),
      debounceTime(1000)
    ).subscribe((action: UpdateActivity) => {
      this.store.dispatch(action);
    });
  }

  /**
   * Activity onChange handling, update the activity in the current task state after a debounce to limit the updates number
   * @param event KeyboardEvent <em>keydown.alt.delete</em>
   */
  handleChange(event?: any): void {
    const newValue = this.activityForm.value;
    this.onUpdateDebouncerSubject.next(new UpdateActivity(newValue, this.index));
  }

  /**
   * Adds an activity in the current task state as a next sibling of this one
   * @param event KeyboardEvent <em>keydown.enter</em>
   */
  createNextActivity(event: KeyboardEvent): void {
    event.preventDefault();
    this.store.dispatch(new CreateActivity(this.index + 1));
  }

  /**
   * Deletes this activity from the current task state
   * @param event KeyboardEvent <em>keydown.alt.delete</em>
   */
  async deleteActivity(event: KeyboardEvent): Promise<void> {
    event.preventDefault();
    await this.animateOut();
    this.store.dispatch(new DeleteActivity(this.index));
  }

  // TODO jsDoc
  onShiftEnter(event: KeyboardEvent): void {
    event.preventDefault();
    // TODO open activity options
  }

  /**
   * Set focus to the activity text input
   */
  focus(): void {
    this.textAreaElement.nativeElement.focus();
  }

  /** Animates the activity into view */
  animateIn(): Promise<void> {
    return animate(this.activityContainer, 'bounceIn', AnimationSpeeds.FAST);
  }

  /** Animates the activity out of view */
  animateOut(): Promise<void> {
    return animate(this.activityContainer, 'bounceOut', AnimationSpeeds.FASTER);
  }

}
