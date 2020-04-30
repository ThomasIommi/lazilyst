import { ChangeDetectorRef, Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Actions, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { takeUntil } from 'rxjs/operators';

import { Activity } from '../../../shared/models/activity';
import { TasksState } from '../../../state/tasks/tasks.state';
import { CreateActivity, DeleteActivity } from '../../../state/tasks/tasks.actions';
import { ActivityComponent } from './activity/activity.component';


@Component({
  selector: 'app-task-activities',
  templateUrl: './task-activities.component.html',
  styleUrls: ['./task-activities.component.scss']
})
export class TaskActivitiesComponent implements OnInit, OnDestroy {

  /** Current task activities observable from NGXS app state */
  @Select(TasksState.currentTaskActivities) activities$: Observable<Activity[]>;

  /** Angular QueryList of ActivityComponent, to set the focus state on activity creation/deletetion */
  @ViewChildren(ActivityComponent) activityComponents: QueryList<ActivityComponent>;

  /** Destroy subscription signal */
  private onDestroySubject: Subject<boolean> = new Subject<boolean>();

  /**
   * Constructor injection
   * @param store NGXS app store
   * @param actions$ NGXS actions observable
   * @param changeDetectorRef Reference to the Angular change detector
   */
  constructor(private store: Store,
              private actions$: Actions,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  /** Constructor main initialization */
  ngOnInit(): void {
    this.autofocusInit();
  }

  /**
   * Executes a subscription to the CreateActivity and DeleteActivity successful actions,
   * then asks angular change detection to update the QueryList of ActivityComponents
   * so that it can set the focus to the right activity component
   */
  private autofocusInit() {
    this.actions$.pipe(
      takeUntil(this.onDestroySubject),
      ofActionSuccessful(CreateActivity, DeleteActivity)
    ).subscribe((activity: CreateActivity | DeleteActivity) => {
      this.changeDetectorRef.detectChanges();
      if (activity instanceof CreateActivity) {
        if (activity.index != null) {
          this.activityComponents.toArray()[activity.index + 1].focus();
        }
      } else if (this.activityComponents.length > 0)  {
        const indexAvailable = this.activityComponents.length > activity.index;
        const index = indexAvailable ? activity.index : (this.activityComponents.length - 1);
        this.activityComponents.toArray()[index].focus();
      }
    });
  }

  /** Cleanup before component destruction */
  ngOnDestroy(): void {
    this.onDestroySubject.next(true);
    this.onDestroySubject.unsubscribe();
  }

}
