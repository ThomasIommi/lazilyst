import { State, StateToken } from '@ngxs/store';
import { Injectable } from '@angular/core';

import { PreferencesState } from './preferences/preferences.state';
import { TasksState, TasksStateModel } from './tasks/tasks.state';


export class AppStateModel {
}

/** Token to identify app state */
export const APP_STATE_TOKEN = new StateToken<TasksStateModel>('app');

@State<AppStateModel>({
  name: APP_STATE_TOKEN,
  defaults: {
  },
  children: [PreferencesState, TasksState]
})
@Injectable()
export class AppState {
}
