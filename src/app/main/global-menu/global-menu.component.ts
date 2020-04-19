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

  /** MenuItems available */
  menuItems: MenuItem[];
  /** Destroy subscription signal */
  private onDestroySubject: Subject<boolean> = new Subject<boolean>();

  constructor(private translateService: TranslateService,
              private dialogService: DialogService,
              private store: Store) {
  }

  /** Initialization */
  ngOnInit(): void {
    this.initMenu();
  }

  /** Cleanup */
  ngOnDestroy(): void {
    this.onDestroySubject.next(true);
    this.onDestroySubject.unsubscribe();
  }

  /** Initialize menu with labels changing accordingly to lang changes */
  private initMenu(): void {
    this.translateService.stream(Object.values(MenuItemLabel))
      .pipe(takeUntil(this.onDestroySubject))
      .subscribe((translationMap: object) => {
        this.menuItems = [
          {
            label: translationMap[MenuItemLabel.LISTS],
            items: [
              {
                label: translationMap[MenuItemLabel.NEW],
                icon: 'pi pi-fw pi-plus'
              },
              {
                label: translationMap[MenuItemLabel.EDIT],
                icon: 'pi pi-fw pi-pencil'
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

  /** Open the modal to select the user language */
  private openSelectLanguageModal(): void {
    const dialogRef = this.dialogService.open(LangSelectionComponent, {
      header: this.translateService.instant('i18n.term.select_lang')
    });
    dialogRef.onClose.pipe(take(1))
      .toPromise()
      .then((selectedLang: string) => {
        this.store.dispatch(new SelectLang(selectedLang));
      });
  }
}
