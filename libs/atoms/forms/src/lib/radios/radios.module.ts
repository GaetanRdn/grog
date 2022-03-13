import { NgModule } from '@angular/core';
import { RadioComponent } from './radio.component';
import { RadiosGroupComponent } from './radios-group.component';

@NgModule({
  declarations: [RadiosGroupComponent, RadioComponent],
  exports: [RadiosGroupComponent, RadioComponent],
})
export class RadiosModule {}
