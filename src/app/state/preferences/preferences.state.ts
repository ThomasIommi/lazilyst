import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import produce from 'immer';

import { SelectLang } from './preferences.actions';
import { TasksStateModel } from '../tasks/tasks.state';


/** Preferences state model */
export class PreferencesStateModel {
  public lang: string;
}

/** Token to identify preferences state */
export const PREFERENCES_STATE_TOKEN = new StateToken<TasksStateModel>('preferences');

/** NGXS app preferences substate */
@State<PreferencesStateModel>({
  name: PREFERENCES_STATE_TOKEN,
  defaults: {
    lang: 'en'
  }
})
@Injectable()
export class PreferencesState {
  // selectors
  /** App language selector */
  @Selector()
  static lang(state: PreferencesStateModel): string {
    return state.lang;
  }

  // actions
  /** Change app language action */
  @Action(SelectLang)
  selectLang(ctx: StateContext<PreferencesStateModel>, action: SelectLang): void {
    const base = ctx.getState();
    ctx.setState(produce(base, (draft: PreferencesStateModel) => {
      draft.lang = action.payload;
    }));
  }
}
