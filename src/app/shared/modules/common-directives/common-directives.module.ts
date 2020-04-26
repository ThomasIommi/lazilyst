import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoBlankDirective } from './directives/no-blank.directive';


@NgModule({
  declarations: [
    NoBlankDirective
  ],
  exports: [
    NoBlankDirective
  ],
  imports: [
    CommonModule
  ]
})
export class CommonDirectivesModule { }
