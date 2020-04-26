import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import produce from 'immer';

import { DeleteCurrentTask, SaveTask, SelectTask } from './tasks.actions';
import { Task } from 'src/app/shared/models/task';
import { DatabaseService } from '../../shared/services/database.service';


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
  /** Current task selector */
  @Selector()
  static currentTask(state: TasksStateModel): Task {
    return state.current;
  }

  /** All tasks selector */
  @Selector()
  static allTasks(state: TasksStateModel): Task[] {
    return state.all;
  }

  // actions
  /** Select current task action */
  @Action(SelectTask)
  selectTask(ctx: StateContext<TasksStateModel>, action: SelectTask): void {
    const base = ctx.getState();
    ctx.setState(produce(base, (draft: TasksStateModel) => {
      draft.current = action.payload;
    }));
  }

  /** Add or update a task action */
  @Action(SaveTask)
  saveTask(ctx: StateContext<TasksStateModel>, action: SaveTask): void {
    const base = ctx.getState();
    ctx.setState(produce(base, (draft: TasksStateModel) => {
      if (action.payload._id != null) {
        // TODO edit
      } else {
        action.payload._id = this.databaseService.getUniqueId(base.all);
        draft.all.push(action.payload);
        draft.current = action.payload;
      }
    }));
  }

  /** Delete the current task action */
  @Action(DeleteCurrentTask)
  deleteCurrentTask(ctx: StateContext<TasksStateModel>): void {
    const base = ctx.getState();
    ctx.setState(produce(base, (draft: TasksStateModel) => {
      const index = base.all.findIndex(task => task._id === base.current._id);
      if (index !== -1) {
        draft.all.splice(index, 1);
        if (draft.all.length > 0) {
          draft.current = draft.all[0];
        } else {
          draft.current = null;
        }
      }
    }));
  }
}
