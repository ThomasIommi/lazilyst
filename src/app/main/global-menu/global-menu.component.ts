import { Component, OnDestroy, OnInit } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { combineLatest, Observable, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Select, Store } from '@ngxs/store';

import { MenuItemLabel } from '../../shared/models/menu-item-label';
import { LangSelectionDialogComponent } from '../../shared/modules/dialog-components/lang-selection-dialog/lang-selection-dialog.component';
import { SelectLang } from '../../state/preferences/preferences.actions';
import { NewTaskDialogComponent } from '../../shared/modules/dialog-components/new-task-dialog/new-task-dialog.component';
import { Task } from 'src/app/shared/models/task';
import { CreateTask, DeleteCurrentTask, UpdateTask } from '../../state/tasks/tasks.actions';
import { ConfirmDialogComponent } from '../../shared/modules/dialog-components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogData } from '../../shared/modules/dialog-components/confirm-dialog/confirm-dialog-data';
import { TASKS_STATE_TOKEN, TasksState, TasksStateModel } from '../../state/tasks/tasks.state';
import { EditTaskDialogComponent } from '../../shared/modules/dialog-components/edit-task-dialog/edit-task-dialog.component';


@Component({
  selector: 'app-global-menu',
  templateUrl: './global-menu.component.html',
  styleUrls: ['./global-menu.component.scss']
})
export class GlobalMenuComponent implements OnInit, OnDestroy {

  /** Available menu items */
  menuItems: MenuItem[];

  /** Current task observable from NGXS app state */
  @Select(TasksState.currentTask) currentTask$: Observable<Task>;

  /** Destroys subscription signal */
  private onDestroySubject: Subject<boolean> = new Subject<boolean>();

  /**
   * Constructor injection
   * @param translateService Service for handling translations by ngx-translate
   * @param dialogService Service for opening NGPrime dialogs
   * @param store NGXS app store
   */
  constructor(private translateService: TranslateService,
              private dialogService: DialogService,
              private store: Store) {
  }

  /** Component main initialization */
  ngOnInit(): void {
    this.initMenu();
  }

  /** Cleanup before component destruction */
  ngOnDestroy(): void {
    this.onDestroySubject.next(true);
    this.onDestroySubject.unsubscribe();
  }

  /** Initializes menu with i18n translated labels */
  private initMenu(): void {
    combineLatest([
      this.translateService.stream(Object.values(MenuItemLabel)),
      this.currentTask$
    ]).pipe(takeUntil(this.onDestroySubject))
      .subscribe(([translationMap, currentTask]) => {
        this.menuItems = [
          {
            label: translationMap[MenuItemLabel.LISTS],
            items: [
              {
                label: translationMap[MenuItemLabel.NEW],
                icon: 'pi pi-fw pi-plus',
                command: this.openNewTaskModal.bind(this)
              },
              {
                label: translationMap[MenuItemLabel.EDIT],
                icon: 'pi pi-fw pi-pencil',
                command: this.openEditTaskModal.bind(this),
                disabled: currentTask == null
              },
              {
                label: translationMap[MenuItemLabel.DELETE],
                icon: 'pi pi-fw pi-trash',
                command: this.openConfirmTaskDeleteModal.bind(this),
                disabled: currentTask == null
              }
            ]
          },
          {
            label: translationMap[MenuItemLabel.PREFERENCES],
            items: [
              {
                label: translationMap[MenuItemLabel.LANGUAGE],
                icon: 'pi pi-fw pi-globe',
                command: this.openSelectLanguageModal.bind(this)
              }
            ]
          }
        ];
      });
  }

  /** Opens a modal to select the user language preference and reacts to its changes */
  private async openSelectLanguageModal(): Promise<void> {
    const dialogRef = this.dialogService.open(LangSelectionDialogComponent, {
      header: this.translateService.instant('i18n.term.select_lang'),
      style: {
        minWidth: '12rem'
      }
    });
    const selectedLang: string = await dialogRef.onClose.pipe(take(1)).toPromise();
    this.store.dispatch(new SelectLang(selectedLang));
  }

  /** Opens a modal to handle the insertion of a new task and reacts to its creation */
  private async openNewTaskModal(): Promise<void> {
    const dialogRef = this.dialogService.open(NewTaskDialogComponent, {
      header: this.translateService.instant('i18n.term.new_task'),
      style: {
        minWidth: '20rem',
        width: '75%'
      }
    });
    const newTask: Task = await dialogRef.onClose.pipe(take(1)).toPromise();
    this.store.dispatch(new CreateTask(newTask));
  }

  /** Opens a modal to handle the editing of the current task and reacts to its changing */
  private async openEditTaskModal(): Promise<void> {
    const dialogRef = this.dialogService.open(EditTaskDialogComponent, {
      header: this.translateService.instant('i18n.term.edit_task'),
      style: {
        minWidth: '20rem',
        width: '75%'
      },
      data: this.store.selectSnapshot<TasksStateModel>(TASKS_STATE_TOKEN).current
    });
    const updatedTask: Task = await dialogRef.onClose.pipe(take(1)).toPromise();
    this.store.dispatch(new UpdateTask(updatedTask));
  }

  /** Opens a modal to ask confirmation for the task deletion */
  private async openConfirmTaskDeleteModal(): Promise<void> {
    const dialogRef = this.dialogService.open(ConfirmDialogComponent, {
      header: this.translateService.instant('i18n.term.confirm') + '?',
      width: '75%',
      data: {
        content: 'i18n.sentence.confirm_task_deletion',
        icon: 'pi pi-exclamation-triangle'
      } as ConfirmDialogData
    });
    const result: boolean = await dialogRef.onClose.pipe(take(1)).toPromise();
    if (result) {
      this.store.dispatch(new DeleteCurrentTask());
    }
  }


}
