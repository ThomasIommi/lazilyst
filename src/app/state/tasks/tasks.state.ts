import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import produce from 'immer';

import {
  CreateActivity,
  CreateTask,
  DeleteCurrentTask,
  SelectTask,
  SyncTasksListWithCurrentTask,
  UpdateTask
} from './tasks.actions';
import { Task } from 'src/app/shared/models/task';
import { DatabaseService } from '../../shared/services/database.service';
import { Activity } from '../../shared/models/activity';


/** Tasks state model */
export class TasksStateModel {
  public current: Task;
  public all: Task[];
}

/** Token to identify tasks state */
export const TASKS_STATE_TOKEN = new StateToken<TasksStateModel>('tasks');

/** NGXS tasks substate */
@State<TasksStateModel>({
  name: TASKS_STATE_TOKEN,
  defaults: {
    all: [],
    current: null
  }
})
@Injectable()
export class TasksState {

  /**
   * Constructor injection
   * @param databaseService Database utility service
   */
  constructor(private databaseService: DatabaseService) {
  }

  // selectors
  /** All tasks selector */
  @Selector()
  static allTasks(state: TasksStateModel): Task[] {
    return state.all;
  }

  /** Current task selector */
  @Selector()
  static currentTask(state: TasksStateModel): Task {
    return state.current;
  }

  /** Current task activities */
  @Selector()
  static currentTaskActivities(state: TasksStateModel): Activity[] {
    return state.current.activities;
  }

  // actions
  /** Selects current task action */
  @Action(SelectTask)
  selectTask(ctx: StateContext<TasksStateModel>, action: SelectTask): void {
    const state: TasksStateModel = ctx.getState();
    ctx.setState(produce(state, (draft: TasksStateModel) => {
      draft.current = action.payload;
    }));
  }

  /** Creates a new task action, then select it as a current task */
  @Action(CreateTask)
  createTask(ctx: StateContext<TasksStateModel>, action: CreateTask): void {
    const state: TasksStateModel = ctx.getState();
    const newTask = Object.assign(new Task(), action.payload);
    newTask._id = this.databaseService.getUniqueId(state.all);
    ctx.setState(produce(state, (draft: TasksStateModel) => {
      draft.all.push(newTask);
    }));
    ctx.dispatch(new SelectTask(newTask));
  }

  /** Updates an existing task action */
  @Action(UpdateTask)
  updateTask(ctx: StateContext<TasksStateModel>, action: UpdateTask): void {
    const state: TasksStateModel = ctx.getState();
    const mergedTask = {...state.current, ...action.payload}
    ctx.setState(produce(state, (draft: TasksStateModel) => {
      draft.current = mergedTask;
    }));
    ctx.dispatch(new SyncTasksListWithCurrentTask());
  }

  /** Deletes the current task action, then selects, if possibile, the first task from the list of all tasks */
  @Action(DeleteCurrentTask)
  deleteCurrentTask(ctx: StateContext<TasksStateModel>): void {
    const state: TasksStateModel = ctx.getState();
    const index = state.all.findIndex(task => task._id === state.current._id);
    if (index !== -1) {
      ctx.setState(produce(state, (draft: TasksStateModel) => {
        draft.all.splice(index, 1);
      }));
    }
    ctx.dispatch(new SelectTask(ctx.getState().all[0]));
  }

  /** Synchronizes the complete tasks list with the changes that have happened to the current task */
  @Action(SyncTasksListWithCurrentTask)
  syncTasksListWithCurrentTask(ctx: StateContext<TasksStateModel>): void {
    const state: TasksStateModel = ctx.getState();
    const index = state.all.findIndex(task => task._id === state.current._id);
    if (index !== -1) {
      ctx.setState(produce(state, (draft: TasksStateModel) => {
        draft.all[index] = state.current;
      }));
    }
  }

  /** Creates an empty activity and adds it to the current task activities */
  @Action(CreateActivity)
  createActivity(ctx: StateContext<TasksStateModel>): void {
    const state: TasksStateModel = ctx.getState();
    const activity = new Activity();
    activity._id = this.databaseService.getUniqueId(state.current.activities);
    ctx.setState(produce(state, (draft: TasksStateModel) => {
      draft.current.activities.push(activity);
    }));
    ctx.dispatch(new SyncTasksListWithCurrentTask());
  }
}
