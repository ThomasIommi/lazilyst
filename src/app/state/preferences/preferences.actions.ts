/** Change app language action */
export class SelectLang {
  static readonly type = '[Preferences] Select Lang';
  constructor(public selectedLang: string) { }
}
