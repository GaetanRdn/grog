import { Directive, ElementRef, Input, NgModule } from '@angular/core';

const BUTTON_HOST_ATTRIBUTES = ['groButton', 'groRaisedButton', 'groIconButton'] as const;

@Directive({
  selector: 'button[groButton], button[groRaisedButton], button[groIconButton]',
  // standalone: true,
  host: {
    class: 'gro-base-button',
    '[class.gro-small]': 'size === "small"',
    '[class.gro-medium]': 'size === "medium"',
    '[class.gro-large]': 'size === "large"',
    '[class.gro-default]': 'color === "default"',
    '[class.gro-primary]': 'color === "primary"',
    '[class.gro-accent]': 'color === "accent"',
    '[class.gro-error]': 'color === "error"',
  },
})
export class ButtonDirective {
  @Input()
  public size: 'small' | 'medium' | 'large' = 'small';

  @Input()
  public color: 'default' | 'primary' | 'accent' | 'error' = 'default';

  constructor(private _elementRef: ElementRef) {
    for (const attribute of BUTTON_HOST_ATTRIBUTES) {
      if (this.hostElement.hasAttribute(attribute)) {
        // Extract method caml case to kebab case
        this.hostElement.classList.add(attribute.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase());
      }
    }
  }

  private get hostElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }
}

@NgModule({
  declarations: [ButtonDirective],
  exports: [ButtonDirective],
})
export class ButtonModule {}
