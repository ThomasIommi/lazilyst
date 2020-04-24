import { Action, Selector, State, StateContext } from '@ngxs/store';
import produce from 'immer';

import { SelectLang } from './preferences.actions';
import { Injectable } from '@angular/core';

export class PreferencesStateModel {
  public lang: string;
}

@State<PreferencesStateModel>({
  name: 'preferences',
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
    ctx.setState(produce((draft: PreferencesStateModel) => {
      draft.lang = action.payload;
    }));
  }
}
