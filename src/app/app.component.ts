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
  // TODO load app preferences from IndexedDB into store

  /** App language observable */
  @Select(PreferencesState.lang) lang$: Observable<string>;
  /** Destroy subscription signal */
  private onDestroySubject: Subject<boolean> = new Subject<boolean>();

  /**
   * Constructor injection
   * @param translateService Service for handling translations by ngx-translate
   */
  constructor(private translateService: TranslateService) {
  }

  /** Initialization */
  ngOnInit(): void {
    this.initLangChangeEventHandler();
  }

  /** Clenup */
  ngOnDestroy(): void {
    this.onDestroySubject.next(true);
    this.onDestroySubject.unsubscribe();
  }

  /** Handler to react to language change events */
  private initLangChangeEventHandler(): void {
    this.lang$.pipe(takeUntil(this.onDestroySubject))
      .subscribe((lang: string) => {
        console.log(lang);
        this.translateService.use(lang);
      });
  }
}
