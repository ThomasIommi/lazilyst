import { ChangeDetectorRef, Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Actions, ofActionDispatched, ofActionSuccessful, Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { TasksState } from '../../../state/tasks/tasks.state';
import { ActivityComponent } from './activity/activity.component';
import { CreateActivity, DeleteActivity, SelectTask, SelectTaskById, UpdateActivity } from '../../../state/tasks/tasks.actions';
import { Task } from '../../../shared/models/task';
import { Activity } from '../../../shared/models/activity';


@Component({
  selector: 'app-task-activities',
  templateUrl: './task-activities.component.html',
  styleUrls: ['./task-activities.component.scss']
})
export class TaskActivitiesComponent implements OnInit, OnDestroy {

  /** Angular QueryList of ActivityComponent, to set the focus state on activity creation/deletetion */
  @ViewChildren(ActivityComponent) activityComponents: QueryList<ActivityComponent>;

  /** Destroy subscription signal */
  private onDestroySubject: Subject<boolean> = new Subject<boolean>();

  /** Task main FormGroup */
  taskForm: FormGroup;

  /** Activities form array */
  activitiesFormArray: FormArray;

  /**
   * Constructor injection
   * @param store NGXS app store
   * @param actions$ NGXS actions observable
   * @param changeDetectorRef Reference to the Angular change detector
   * @param formBuilder Angular reactive form builder
   */
  constructor(private store: Store,
              private actions$: Actions,
              private changeDetectorRef: ChangeDetectorRef,
              private formBuilder: FormBuilder) {
  }

  /** Constructor main initialization */
  ngOnInit(): void {
    this.initForm();
    this.initStateToFormBinding();
    this.initUpdateActivityDebouncer();
  }

  /** Cleanup before component destruction */
  ngOnDestroy(): void {
    this.onDestroySubject.next(true);
    this.onDestroySubject.unsubscribe();
  }

  /** Form initialization */
  private initForm(): void {
    this.activitiesFormArray = this.formBuilder.array([]);
    this.taskForm = this.formBuilder.group({
      activities: this.activitiesFormArray
    });
    const currentTask = this.store.selectSnapshot<Task>(TasksState.currentTask);
    currentTask.activities.forEach(() => {
      this.activitiesFormArray.push(this.formBuilder.control(null));
    });
    this.taskForm.patchValue(currentTask);
  }

  /** Executes a subscription to the CreateActivity and SelectTask successful actions to update the form when needed */
  private initStateToFormBinding(): void {
    this.actions$.pipe(
      takeUntil(this.onDestroySubject),
      ofActionSuccessful(SelectTask, SelectTaskById, CreateActivity, DeleteActivity)
    ).subscribe(action => {
      switch (action.constructor) {
        case CreateActivity:
          this.addFormControl(action.index);
          break;
        case DeleteActivity:
          this.deleteFormControl(action.index);
          break;
        case SelectTask:
        case SelectTaskById:
          this.initForm();
          break;
      }
    });
  }

  /** Executes a subscription to the UpdateActivity dispatched actions to apply a debouncer */
  private initUpdateActivityDebouncer(): void {
    this.actions$.pipe(
      takeUntil(this.onDestroySubject),
      ofActionDispatched(UpdateActivity),
      debounceTime(1000)
    ).subscribe();
  }

  /**
   * Requests the store to add a new activity on a specific index
   * @param index Index where to add a new activity
   */
  addActivity(index: number): void {
    this.store.dispatch(new CreateActivity(index));
  }

  /**
   * Requests the store to delete the activity on a specific index
   * @param index Index identifying the activity to delete
   */
  deleteActivity(index: number): void {
    this.store.dispatch(new DeleteActivity(index));
  }

  /**
   * Requests the store to update the activity on a specific index
   * @param value Activity new value
   * @param index Index identifying the activity to update
   */
  updateActivity(value: Activity, index: number): void {
    this.store.dispatch(new UpdateActivity(value, index));
  }

  /**
   * Adds a new form control to the activities form handling animations
   * @param index Index where to add new form control
   */
  private addFormControl(index: number): void {
    const fromNewButton: boolean = index == null;
    if (fromNewButton) {
      index = this.activitiesFormArray.length;
    } else {
      index = index + 1;
    }
    this.activitiesFormArray.insert(index, this.formBuilder.control(null));
    this.changeDetectorRef.detectChanges();
    this.activityComponents.toArray()[index].animateIn();
    if (!fromNewButton) {
      this.activityComponents.toArray()[index].focus();
    }
  }

  /**
   * Deletes the form control from the activities form handling animations
   * @param index Index identifying the activity to delete
   */
  private async deleteFormControl(index: number): Promise<void> {
    if (this.activityComponents.length > 0) {
      await this.activityComponents.toArray()[index].animateOut();
      this.activitiesFormArray.removeAt(index);
      this.changeDetectorRef.detectChanges();
      index = this.activityComponents.length > index ? index : (this.activityComponents.length - 1);
      if (index >= 0) {
        this.activityComponents.toArray()[index].focus();
      }
    }
  }

}
