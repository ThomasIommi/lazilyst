import { PREFERENCES_STATE_TOKEN, PreferencesState } from './preferences/preferences.state';
import { TASKS_STATE_TOKEN, TasksState } from './tasks/tasks.state';


export const applicationStates = [
  PreferencesState,
  TasksState
];

export const applicationStateTokens = [
  PREFERENCES_STATE_TOKEN,
  TASKS_STATE_TOKEN
];
