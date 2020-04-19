import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SelectLang } from './preferences.actions';
import produce from 'immer';

export class PreferencesStateModel {
  public lang: string;
}

@State<PreferencesStateModel>({
  name: 'preferences',
  defaults: {
    lang: 'en'
  }
})
export class PreferencesState {
  // selectors
  /** App language selector */
  @Selector()
  static lang(state: PreferencesStateModel) {
    return state.lang;
  }

  // actions
  /** Change app language action */
  @Action(SelectLang)
  selectLang(ctx: StateContext<PreferencesStateModel>, action: SelectLang) {
    ctx.setState(produce((draft: PreferencesStateModel) => {
      draft.lang = action.payload;
    }));
  }
}
