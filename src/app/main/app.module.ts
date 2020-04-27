import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { FieldsetModule } from 'primeng/fieldset';
import { NgxsModule } from '@ngxs/store';
import { NgxsIonicStorageModule } from '@iommi/ngxs-ionic-storage';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskSelectorComponent } from './task/task-selector/task-selector.component';
import { GlobalMenuComponent } from './global-menu/global-menu.component';
import { DialogComponentsModule } from '../shared/modules/dialog-components/dialog-components.module';
import { TaskInfosComponent } from './task/task-infos/task-infos.component';
import { environment } from '../../environments/environment';
import { applicationStates, applicationStateTokens } from '../state/store-index';
import { ActivitiesListComponent } from './task/activity/activities-list/activities-list.component';
import { SingleActivityComponent } from './task/activity/single-activity/single-activity.component';
import { CreateActivityButtonComponent } from './task/activity/create-activity-button/create-activity-button.component';

/** NgxTranslate basic http loader */
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    TaskSelectorComponent,
    GlobalMenuComponent,
    TaskInfosComponent,
    ActivitiesListComponent,
    SingleActivityComponent,
    CreateActivityButtonComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    DialogComponentsModule,
    DynamicDialogModule,
    DropdownModule,
    FieldsetModule,
    HttpClientModule,
    InputTextModule,
    MenuModule,
    NgxsIonicStorageModule.forRoot({
      storeName: 'AppState',
      name: 'LazilystAppStorage',
      version: 1.0,
      key: applicationStateTokens
    }),
    NgxsModule.forRoot(applicationStates, {
      developmentMode: !environment.production
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({
      name: 'LazilystAppState',
      disabled: environment.production
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'en'
    })
  ],
  providers: [DialogService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
