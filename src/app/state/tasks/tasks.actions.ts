import { Task } from '../../shared/models/task';

export class SelectTask {
  static readonly type = '[Tasks] Select task';
  constructor(public payload: Task) { }
}
