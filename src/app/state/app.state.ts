import { State } from '@ngxs/store';
import { PreferencesState } from './preferences/preferences.state';
import { TasksState } from './tasks/tasks.state';
import { Injectable } from '@angular/core';

export class AppStateModel {
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
  },
  children: [PreferencesState, TasksState]
})
@Injectable()
export class AppState {
}
