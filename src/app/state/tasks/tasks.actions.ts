import { Task } from '../../shared/models/task';


/** Select current task action */
export class SelectTask {
  static readonly type = '[Tasks] Select task';
  constructor(public payload: Task) { }
}

/** Add or update a task action */
export class SaveTask {
  static readonly type = '[Tasks] Save task';
  constructor(public payload: Task) { }
}

/** Delete the current task action */
export class DeleteCurrentTask {
  static readonly type = '[Tasks] Delete current task';
  constructor() {
  }
}
