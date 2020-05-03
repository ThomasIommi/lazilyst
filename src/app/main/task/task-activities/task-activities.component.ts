import { ChangeDetectorRef, Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Actions, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TasksState } from '../../../state/tasks/tasks.state';
import { ActivityComponent } from './activity/activity.component';
import { CreateActivity, DeleteActivity, MoveActivity } from '../../../state/tasks/tasks.actions';
import { dndClean, dndFindDropIndex, dndHide, dndMakeSpace } from '../../../shared/functions/animate.functions';
import { AnimationDirection } from '../../../shared/models/animation-models';
import { Activity } from '../../../shared/models/activity';


@Component({
  selector: 'app-task-activities',
  templateUrl: './task-activities.component.html',
  styleUrls: ['./task-activities.component.scss']
})
export class TaskActivitiesComponent implements OnInit, OnDestroy {

  /** Current task activities observable from NGXS app state */
  @Select(TasksState.currentTaskActivities) activities$: Observable<Activity[]>;

  /** Angular QueryList of ActivityComponent, to handle the focus of activities */
  @ViewChildren(ActivityComponent) activityComponents: QueryList<ActivityComponent>;

  /** Destroy subscription signal */
  private onDestroySubject: Subject<boolean> = new Subject<boolean>();

  /** Reference to the element dragged during drag&drop */
  private dragged: HTMLDivElement;

  /** Index of the element being dragged */
  private draggedIndex: number;

  /** Array of function to handle drag&drop animations */
  private moveFunctions: ((x: number) => void)[] = [];

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
    this.initFocusHandler();
  }

  /** Cleanup before component destruction */
  ngOnDestroy(): void {
    this.onDestroySubject.next(true);
    this.onDestroySubject.unsubscribe();
  }

  /**
   * Executes a subscription to activity creation and deletion successful actions to set the focus to a specific activity
   */
  private initFocusHandler(): void {
    this.actions$.pipe(
      takeUntil(this.onDestroySubject),
      ofActionSuccessful(CreateActivity, DeleteActivity)
    ).subscribe(action => {
      switch (action.constructor) {
        case CreateActivity:
        case DeleteActivity:
          this.focusNextElement(action.index);
          break;
      }
    });
  }

  /**
   * Focuses the proper activity after the creation of a new activity or a deletion
   * @param index Index of the activity to focus
   */
  private focusNextElement(index: number): void {
    this.changeDetectorRef.detectChanges();
    if (this.activityComponents.length > 0) {
      index = index == null || index >= this.activityComponents.length ? this.activityComponents.length - 1 : index;
      this.activityComponents.toArray()[index].focus();
    }
  }

  /**
   * Track function to avoid the DOM manipulation of unchanged activities every state change
   * it compares the activity id
   * @param index Index of the activity
   * @param activity Activity tracked
   */
  trackActivities(index: number, activity: Activity): string {
    return activity._id;
  }

  /**
   * Handler for drag&grop event on drag start
   * @param dragElement Dragged activity div container
   * @param index Index of the element being dragged
   */
  async dragStart(dragElement: HTMLDivElement, index: number): Promise<void> {
    this.dragged = dragElement;
    this.draggedIndex = index;

    const height = dragElement.getBoundingClientRect().height;
    await dndHide(dragElement);

    let next: HTMLElement = dragElement.nextElementSibling as HTMLElement;
    while (next) {
      const nextCopy = next;
      const threshold = next.getBoundingClientRect().top;
      this.moveFunctions.push((x: number) => {
        dndMakeSpace.bind(undefined, nextCopy, AnimationDirection.UP, height, threshold, x)();
      });
      next = next.nextElementSibling as HTMLElement;
    }
    let prev: HTMLElement = dragElement.previousElementSibling as HTMLElement;
    while (prev) {
      const prevCopy = prev;
      const threshold = prev.getBoundingClientRect().bottom;
      this.moveFunctions.push((x: number) => {
        dndMakeSpace.bind(undefined, prevCopy, AnimationDirection.DOWN, height, threshold, x)();
      });
      prev = prev.previousElementSibling as HTMLElement;
    }
  }

  /**
   * Handler for drag&drop event on drag
   * @param event drag DragEvent
   */
  drag(event: DragEvent): void {
    this.moveFunctions.forEach(f => f(event.clientY));
  }

  /**
   * Handler for drag&drop event on drag end
   * @param dropZone List of activities container drop zone
   */
  dragEnd(dropZone: HTMLDivElement): void {
    this.resetDndAttributes(dropZone);
  }

  /**
   * Handler for drag&drop event on drop
   * @param dropZone List of activities container drop zone
   */
  drop(dropZone: HTMLDivElement): void {
    const dropIndex = dndFindDropIndex(dropZone, this.draggedIndex);
    if (dropIndex !== -1) {
      this.store.dispatch(new MoveActivity(this.draggedIndex, dropIndex));
    }
    this.resetDndAttributes(dropZone);
  }

  /** Checks if there is an ongoing operation of drag&drop */
  isDragging(): boolean {
    return this.dragged != null;
  }

  /**
   * Resets all drag&drop attributes and used inline styles
   * @param dropZone List of activities container drop zone
   */
  private resetDndAttributes(dropZone: HTMLDivElement): void {
    if (this.isDragging()) {
      dndClean(Array.from(dropZone.children) as HTMLElement[]);
    }
    this.dragged = null;
    this.draggedIndex = null;
    this.moveFunctions.length = 0;
  }

}
