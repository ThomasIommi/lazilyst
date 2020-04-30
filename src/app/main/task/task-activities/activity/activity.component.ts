import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';

import { Activity } from '../../../../shared/models/activity';
import { animate } from '../../../../shared/functions/animate.functions';
import { AnimationSpeeds } from '../../../../shared/models/animation-speed';
import { CreateActivity, DeleteActivity, UpdateActivity } from '../../../../state/tasks/tasks.actions';


@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit, AfterViewInit {

  /** Activity that this component represent */
  @Input() activity: Activity;

  /** Index of the current activity */
  @Input() index: number;

  /** Reference to activity main container to handle animations */
  @ViewChild('activityContainer') activityContainer: ElementRef;

  /** Reference to activity textarea to handle focus */
  @ViewChild('textAreaElement') textAreaElement: ElementRef;

  /**
   * Constructor injection
   * @param store NGXS app store
   */
  constructor(private store: Store) {
  }

  /** Component main initialization */
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    animate(this.activityContainer, 'bounceIn', AnimationSpeeds.FAST);
  }

  /**
   * Set focus to the activity text input
   */
  focus(): void {
    this.textAreaElement.nativeElement.focus();
  }

  /**
   * Creates an new activity on a specific index and then set the focus to it
   * @param event KeyboardEvent <em>keydown.enter</em>
   */
  createNewActivity(event: KeyboardEvent) {
    event.preventDefault();
    this.store.dispatch(new CreateActivity(this.index));
  }

  /**
   * Deletes the activity on a specific index and then set focus to the first available activity
   * @param event KeyboardEvent <em>keydown.alt.delete</em>
   */
  async deleteActivity(event: KeyboardEvent) {
    event.preventDefault();
    await animate(this.activityContainer, 'bounceOut', AnimationSpeeds.FASTER);
    this.store.dispatch(new DeleteActivity(this.index));
  }

  /**
   * Updates the store with the changes made to this activity
   * @param event FocusEvent <em>focusOut</em>
   */
  updateActivity(event: FocusEvent): void {
    event.preventDefault();
    this.store.dispatch(new UpdateActivity(this.activity, this.index));
  }

  // TODO jsDoc
  openActivityOptions(event: KeyboardEvent) {
    event.preventDefault();
    // TODO open activity options
  }

}
