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
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskSelectorComponent } from './header/task-selector/task-selector.component';
import { GlobalMenuComponent } from './header/global-menu/global-menu.component';
import { DialogComponentsModule } from '../shared/modules/dialog-components';
import { TaskInfosComponent } from './task/task-infos/task-infos.component';
import { environment } from '../../environments/environment';
import { applicationStates, applicationStateTokens } from '../state/store-index';
import { TaskActivitiesComponent } from './task/task-activities/task-activities.component';
import { ActivityComponent } from './task/task-activities/activity/activity.component';
import { HeaderComponent } from './header/header.component';
import { TaskMenuComponent } from './task/task-menu/task-menu.component';
import { TaskComponent } from './task/task.component';
import { CommonDirectivesModule } from '../shared/modules/common-directives/common-directives.module';

/** NgxTranslate basic http loader */
export function HttpLoaderFactory(http: HttpClient): TranslateLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    TaskSelectorComponent,
    GlobalMenuComponent,
    TaskInfosComponent,
    TaskActivitiesComponent,
    ActivityComponent,
    HeaderComponent,
    TaskMenuComponent,
    TaskComponent
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
    }),
    InputTextareaModule,
    CommonDirectivesModule,
    ReactiveFormsModule
  ],
  providers: [DialogService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
