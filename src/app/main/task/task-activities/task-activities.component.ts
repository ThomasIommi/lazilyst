import { ChangeDetectorRef, Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Actions, ofActionSuccessful, Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';

import { TasksState } from '../../../state/tasks/tasks.state';
import { ActivityComponent } from './activity/activity.component';
import { CreateActivity, DeleteActivity, SelectTask, SelectTaskById, UpdateTask } from '../../../state/tasks/tasks.actions';
import { Task } from '../../../shared/models/task';


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
    this.stateToFormBinding();
    this.formToStateBinding();
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

  /**
   * Executes a subscription to the CreateActivity and SelectTask successful actions
   */
  private stateToFormBinding(): void {
    this.actions$.pipe(
      takeUntil(this.onDestroySubject),
      ofActionSuccessful(SelectTask, SelectTaskById, CreateActivity, DeleteActivity)
    ).subscribe(activity => {
      switch (activity.constructor) {
        case CreateActivity:
          this.addFormControl(activity.index);
          break;
        case DeleteActivity:
          this.deleteFormControl(activity.index);
          break;
        case SelectTask:
        case SelectTaskById:
          this.initForm();
          break;
      }
    });
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
      console.log('removed', this.taskForm.value);
      index = this.activityComponents.length > index ? index : (this.activityComponents.length - 1);
      if (index >= 0) {
        this.activityComponents.toArray()[index].focus();
      }
    }
  }

  /** Binds the form updates (debounced) to the state, persisisting them */
  private formToStateBinding(): void {
    this.taskForm.valueChanges.pipe(
      takeUntil(this.onDestroySubject),
      debounceTime(500)
    ).subscribe(changes => {
      this.store.dispatch(new UpdateTask(changes));
    });
  }
}
