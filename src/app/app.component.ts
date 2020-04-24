import { Component, OnDestroy, OnInit } from '@angular/core';
import { PreferencesState } from './state/preferences/preferences.state';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  /** App language observable from NGXS app state */
  @Select(PreferencesState.lang) lang$: Observable<string>;

  /** Destroy subscription signal */
  private onDestroySubject: Subject<boolean> = new Subject<boolean>();

  /**
   * Constructor injection
   * @param translateService Service for handling translations by ngx-translate
   */
  constructor(private translateService: TranslateService) {
  }

  /** Component main initialization */
  ngOnInit(): void {
    this.initLangChangeEventHandler();
  }

  /** Cleanup before component destruction */
  ngOnDestroy(): void {
    this.onDestroySubject.next(true);
    this.onDestroySubject.unsubscribe();
  }

  /** Handler to react to language change events */
  private initLangChangeEventHandler(): void {
    this.lang$.pipe(takeUntil(this.onDestroySubject))
      .subscribe((lang: string) => {
        this.translateService.use(lang);
      });
  }
}
