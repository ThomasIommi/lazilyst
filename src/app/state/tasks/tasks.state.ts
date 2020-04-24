import { Action, Selector, State, StateContext } from '@ngxs/store';
import produce from 'immer';

import { SelectTask } from './tasks.actions';
import { Task } from 'src/app/shared/models/task';
import { Injectable } from '@angular/core';

export class TasksStateModel {
  public current: Task;
  public all: Task[];
}

@State<TasksStateModel>({
  name: 'tasks',
  defaults: {
    all: [],
    current: null
  }
})
@Injectable()
export class TasksState {
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
    ctx.setState(produce((draft: TasksStateModel) => {
      if (action.payload != null) {
        draft.current = action.payload;
      } else if (draft.all != null && draft.all.length !== 0) {
        draft.current = draft.all[0];
      } else {
        draft.current = null;
      }
    }));
  }
}
