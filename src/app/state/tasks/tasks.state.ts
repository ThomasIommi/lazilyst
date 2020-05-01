import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import produce from 'immer';
import * as deepmerge from 'deepmerge';

import {
  CreateActivity,
  CreateTask,
  DeleteActivity,
  DeleteCurrentTask,
  SelectTask,
  SelectTaskById,
  UpdateTask
} from './tasks.actions';
import { Task } from 'src/app/shared/models/task';
import { DatabaseService } from '../../shared/services/database.service';
import { Activity } from '../../shared/models/activity';
import { overwriteMerge } from '../../shared/functions/generic.functions';


/** Tasks state model */
export class TasksStateModel {
  public currentIndex: number;
  public all: Task[];
}

/** Token to identify tasks state */
export const TASKS_STATE_TOKEN = new StateToken<TasksStateModel>('tasks');

/** NGXS tasks substate */
@State<TasksStateModel>({
  name: TASKS_STATE_TOKEN,
  defaults: {
    all: [],
    currentIndex: null
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
  static all(state: TasksStateModel): Task[] {
    return state.all;
  }

  /** Current index selector */
  @Selector()
  static currentIndex(state: TasksStateModel): number {
    return state.currentIndex;
  }

  /** Current task selector */
  @Selector()
  static currentTask(state: TasksStateModel): Task {
    return state.all[state.currentIndex];
  }

  /** Current task activities */
  @Selector()
  static currentTaskActivities(state: TasksStateModel): Activity[] {
    return state.all[state.currentIndex].activities;
  }

  // actions
  /** Selects current task action */
  @Action(SelectTask)
  selectTask(ctx: StateContext<TasksStateModel>, action: SelectTask): void {
    ctx.setState(produce((draft: TasksStateModel) => {
      draft.currentIndex = draft.all.length > 0 ? action.index : null;
    }));
  }

  /** Select current task by id action */
  @Action(SelectTaskById)
  selectTaskById(ctx: StateContext<TasksStateModel>, action: SelectTaskById): void {
    ctx.setState(produce((draft: TasksStateModel) => {
      draft.currentIndex = draft.all.findIndex(task => task._id === action.id);
    }));
  }

  /** Creates a new task action, then select it as a current task */
  @Action(CreateTask)
  createTask(ctx: StateContext<TasksStateModel>, action: CreateTask): void {
    const newTask = deepmerge(new Task(), action.newTask);
    newTask._id = this.databaseService.getUniqueId(ctx.getState().all);
    ctx.setState(produce((draft: TasksStateModel) => {
      draft.all.push(newTask);
    }));
    ctx.dispatch(new SelectTask(ctx.getState().all.length - 1));
  }

  /** Updates an existing task action */
  @Action(UpdateTask)
  updateTask(ctx: StateContext<TasksStateModel>, action: UpdateTask): void {
    ctx.setState(produce((draft: TasksStateModel) => {
      console.log(action.updatedTask);
      draft.all[draft.currentIndex] = deepmerge(draft.all[draft.currentIndex], action.updatedTask, {arrayMerge: overwriteMerge});
    }));
  }

  /** Deletes the current task action, then selects, if possibile, the first task from the list of all tasks */
  @Action(DeleteCurrentTask)
  deleteCurrentTask(ctx: StateContext<TasksStateModel>): void {
    ctx.setState(produce((draft: TasksStateModel) => {
      draft.all.splice(draft.currentIndex, 1);
    }));
    ctx.dispatch(new SelectTask(0));
  }

  /** Creates an empty activity and adds it to the current task activities */
  @Action(CreateActivity)
  createActivity(ctx: StateContext<TasksStateModel>, action: CreateActivity): void {
    const state: TasksStateModel = ctx.getState();
    const activity = new Activity();
    activity._id = this.databaseService.getUniqueId(state.all[state.currentIndex].activities);
    ctx.setState(produce((draft: TasksStateModel) => {
      if (action.index == null) {
        draft.all[draft.currentIndex].activities.push(activity);
      } else {
        draft.all[draft.currentIndex].activities.splice(action.index + 1, 0, activity);
      }
    }));
  }

  /** Deletes an activity by its index action */
  @Action(DeleteActivity)
  deleteActivity(ctx: StateContext<TasksStateModel>, action: DeleteActivity): void {
    ctx.setState(produce((draft: TasksStateModel) => {
      if (action.index != null) {
        draft.all[draft.currentIndex].activities.splice(action.index, 1);
      }
    }));
  }

}
