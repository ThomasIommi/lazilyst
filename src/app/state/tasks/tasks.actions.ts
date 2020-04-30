import { Task } from '../../shared/models/task';
import { Activity } from '../../shared/models/activity';


/** Selects current task action */
export class SelectTask {
  static readonly type = '[Tasks] Select task';

  constructor(public selectedTask: Task) {
  }
}

/** Creates a new task action */
export class CreateTask {
  static readonly type = '[Tasks] Create task';

  constructor(public newTask: Task) {
  }
}

/** Updates an existing task action */
export class UpdateTask {
  static readonly type = '[Tasks] Update task';

  constructor(public updatedTask: Task) {
  }
}

/** Deletes the current task action */
export class DeleteCurrentTask {
  static readonly type = '[Tasks] Delete current task';
}

/** Synchronizes the complete tasks action */
export class SyncTasksListWithCurrentTask {
  static readonly type = '[Tasks] Update task list';
}

/** Creates an activity action */
export class CreateActivity {
  static readonly type = '[Activity] Create activity';

  constructor(public index?: number) {
  }
}

/** Deletes an activity action */
export class DeleteActivity {
  static readonly type = '[Activity] Delete activity';

  constructor(public index: number) {
  }
}

/** Updates an activity action */
export class UpdateActivity {
  static readonly type = '[Activity] Update activity';

  constructor(public updatedActivity: Activity, public index: number) {
  }
}
