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

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskSelectorComponent } from './main/task/task-selector/task-selector.component';
import { GlobalMenuComponent } from './main/global-menu/global-menu.component';
import { DialogComponentsModule } from './shared/modules/dialog-components/dialog-components.module';
import { TaskInfosComponent } from './main/task/task-infos/task-infos.component';
import { environment } from '../environments/environment';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { applicationStates } from './state/store-index';
import { AppState } from './state/app.state';
import { FormsModule } from '@angular/forms';

/** NgxTranslate basic http loader */
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    TaskSelectorComponent,
    GlobalMenuComponent,
    TaskInfosComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    DialogComponentsModule,
    DynamicDialogModule,
    DropdownModule,
    FieldsetModule,
    HttpClientModule,
    MenuModule,
    NgxsIonicStorageModule.forRoot({
      storeName: 'AppState',
      name: 'lazilystAppStorage',
      version: 1.0
    }),
    NgxsModule.forRoot(applicationStates, {
      developmentMode: !environment.production
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({
      name: 'lazilystAppState',
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
    FormsModule
  ],
  providers: [DialogService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
