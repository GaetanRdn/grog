import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'gro-material-icon',
  host: {
    class: 'material-icons',
  },
  template: ` <ng-content></ng-content>`,
})
export class MaterialIconComponent {}

@NgModule({
  declarations: [MaterialIconComponent],
  exports: [MaterialIconComponent],
})
export class MaterialIconModule {}
