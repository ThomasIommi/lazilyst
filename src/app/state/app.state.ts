import { State } from '@ngxs/store';
import { PreferencesState } from './preferences/preferences.state';

export class AppStateModel {
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
  },
  children: [PreferencesState]
})
export class AppState {
}
