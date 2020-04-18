export class Task {

  /** List name */
  private _name: string;

  /** Basic costructor */
  constructor(name: string) {
    this._name = name;
  }

  /** Name getter */
  get name(): string {
    return this._name;
  }

}
