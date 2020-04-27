import { Task } from '../../shared/models/task';


/** Selects current task action */
export class SelectTask {
  static readonly type = '[Tasks] Select task';

  constructor(public payload: Task) {
  }
}

/** Creates a new task action */
export class CreateTask {
  static readonly type = '[Tasks] Create task';

  constructor(public payload: Task) {
  }
}

/** Updates an existing task action */
export class UpdateTask {
  static readonly type = '[Tasks] Update task';

  constructor(public payload: Task) {
  }
}

/** Deletes the current task action */
export class DeleteCurrentTask {
  static readonly type = '[Tasks] Delete current task';

  constructor() {
  }
}

/** Synchronizes the complete tasks action */
export class SyncTasksListWithCurrentTask {
  static readonly type = '[Tasks] Update task list';

  constructor() {
  }
}


/** Creates an activity action */
export class CreateActivity {
  static readonly type = '[Activity] Create activity';

  constructor() {
  }
}

