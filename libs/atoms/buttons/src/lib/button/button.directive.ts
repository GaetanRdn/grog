import { Directive, Input, NgModule } from '@angular/core';
import { CoerceBoolean } from '@grorg/decorators';

@Directive({
  selector: 'button[groButton]',
  // standalone: true,
  host: {
    class: 'gro-button',
    '[class.gro-small]': 'size === "small"',
    '[class.gro-medium]': 'size === "medium"',
    '[class.gro-large]': 'size === "large"',
    '[class.gro-outlined]': 'outlined',
    '[class.gro-primary]': 'color === "primary"',
    '[class.gro-accent]': 'color === "accent"',
    '[class.gro-warn]': 'color === "warn"',
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
