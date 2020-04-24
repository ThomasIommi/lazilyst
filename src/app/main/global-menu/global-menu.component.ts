import { Component, OnDestroy, OnInit } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

import { MenuItemLabel } from '../../shared/models/menu-item-label';
import { LangSelectionComponent } from '../../shared/modules/dialog-components/lang-selection/lang-selection.component';
import { Store } from '@ngxs/store';
import { SelectLang } from '../../state/preferences/preferences.actions';

@Component({
  selector: 'app-global-menu',
  templateUrl: './global-menu.component.html',
  styleUrls: ['./global-menu.component.scss']
})
export class GlobalMenuComponent implements OnInit, OnDestroy {

  /** Available menu items */
  menuItems: MenuItem[];

  /** Destroy subscription signal */
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

  /** Initialize menu with i18n translated labels */
  private initMenu(): void {
    this.translateService.stream(Object.values(MenuItemLabel))
      .pipe(takeUntil(this.onDestroySubject))
      .subscribe((translationMap: object) => {
        this.menuItems = [
          {
            label: translationMap[MenuItemLabel.LISTS],
            items: [
              {
                label: translationMap[MenuItemLabel.NEW], // TODO new task
                icon: 'pi pi-fw pi-plus'
              },
              {
                label: translationMap[MenuItemLabel.EDIT], // TODO edit task
                icon: 'pi pi-fw pi-pencil'
              },
              {
                label: translationMap[MenuItemLabel.DELETE], // TODO delete task
                icon: 'pi pi-fw pi-trash'
              }
            ]
          },
          {
            label: translationMap[MenuItemLabel.PREFERENCES],
            items: [
              {
                label: translationMap[MenuItemLabel.LANGUAGE],
                icon: 'pi pi-fw pi-globe',
                command: () => this.openSelectLanguageModal()
              }
            ]
          }
        ];
      });
  }

  /** Open a modal to select the user language preference */
  private async openSelectLanguageModal(): Promise<void> {
    const dialogRef = this.dialogService.open(LangSelectionComponent, {
      header: this.translateService.instant('i18n.term.select_lang')
    });
    const selectedLang = await dialogRef.onClose.pipe(take(1)).toPromise();
    this.store.dispatch(new SelectLang(selectedLang));
  }
}
