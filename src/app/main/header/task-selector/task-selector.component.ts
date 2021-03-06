import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Dropdown } from 'primeng/dropdown';

import { Task } from '../../../shared/models/task';
import { SelectTaskById } from '../../../state/tasks/tasks.actions';
import { TasksState } from '../../../state/tasks/tasks.state';


@Component({
  selector: 'app-task-selector',
  templateUrl: './task-selector.component.html',
  styleUrls: ['./task-selector.component.scss']
})
export class TaskSelectorComponent implements OnInit, OnDestroy, AfterViewInit {

  /** Current task observable from NGXS app state */
  @Select(TasksState.currentTask) currentTask$: Observable<Task>;

  /** Selectable tasks observable from NGXS app state */
  @Select(TasksState.all) allTasks$: Observable<Task[]>;

  /** Reference to dropdown compoent to handle current task changes */
  @ViewChild('dropdown') dropdown: Dropdown;

  /** Destroys subscription signal */
  private onDestroySubject: Subject<boolean> = new Subject<boolean>();

  /**
   * Constructor injection
   * @param store NGXS app store
   * @param changeDetectorRef Reference to the Angular change detector
   */
  constructor(private store: Store,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  /** Component main initialization */
  ngOnInit(): void {
  }

  /** Initialization after the view is ready */
  ngAfterViewInit(): void {
    this.initCurrentTaskUpdater();
    this.changeDetectorRef.detectChanges();
  }

  /** Cleanup before component destruction */
  ngOnDestroy(): void {
    this.onDestroySubject.next(true);
    this.onDestroySubject.unsubscribe();
  }

  /**
   * Selects the current task
   * @param selectedTask Selected task
   */
  selectTask(selectedTask: Task): void {
    this.store.dispatch(new SelectTaskById(selectedTask._id));
  }

  /** Automatically selects the real current task on app state changes */
  private initCurrentTaskUpdater(): void {
    this.currentTask$.pipe(takeUntil(this.onDestroySubject)).subscribe((currentTask: Task) => {
      this.dropdown.writeValue(currentTask);
    });
  }
}
