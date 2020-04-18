import { Action, State, StateContext } from '@ngxs/store';
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
  @Action(SelectLang)
  selectLang(ctx: StateContext<PreferencesStateModel>, action: SelectLang) {
    ctx.setState(produce((draft: PreferencesStateModel) => {
      draft.lang = action.payload;
    }));
  }
}
