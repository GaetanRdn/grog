import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'adr-label',
  template: `<ng-content></ng-content>`,
})
export class LabelComponent {}

@NgModule({
  declarations: [LabelComponent],
  imports: [CommonModule],
})
export class LabelModule {}
