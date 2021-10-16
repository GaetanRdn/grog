import { Directive, Input, NgModule } from '@angular/core';
import { CoerceBoolean } from '@grorg/decorators';

@Directive({
  selector: 'button[groButton]',
  // standalone: true,
  host: {
    class: 'adr-button',
    '[class.adr-small]': 'size === "small"',
    '[class.adr-medium]': 'size === "medium"',
    '[class.adr-large]': 'size === "large"',
    '[class.adr-outlined]': 'outlined',
    '[class.adr-primary]': 'color === "primary"',
    '[class.adr-accent]': 'color === "accent"',
    '[class.adr-warn]': 'color === "warn"',
  },
})
export class ButtonDirective {
  @Input()
  public size: 'small' | 'medium' | 'large' = 'medium';

  @Input()
  @CoerceBoolean()
  public outlined?: boolean;

  @Input()
  public color: 'primary' | 'accent' | 'warn' = 'primary';
}

@NgModule({
  declarations: [ButtonDirective],
  exports: [ButtonDirective],
})
export class ButtonModule {}
