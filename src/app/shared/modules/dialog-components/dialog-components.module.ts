import { NgModule } from '@angular/core';
import { LangSelectionComponent } from './lang-selection/lang-selection.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  declarations: [
    LangSelectionComponent
  ]
})
export class DialogComponentsModule {
}
