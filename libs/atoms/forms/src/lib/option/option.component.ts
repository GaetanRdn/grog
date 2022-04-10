import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgModule,
  OnInit,
  Output,
} from '@angular/core';
import { CoerceBoolean } from '@grorg/decorators';
import { BooleanInput } from '@grorg/types';

@Component({
  selector: 'gro-option',
  host: {
    '[class.gro-selected]': 'selected',
    '[class.gro-disabled]': 'disabled || null',
  },
  template: ` <ng-content></ng-content>`,
  styleUrls: ['./option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionComponent<ValueType> implements OnInit {
  static ngAcceptInputType_disabled: BooleanInput;

  @Input()
  public value!: ValueType;

  @Input()
  @CoerceBoolean()
  public disabled = false;

  @Output()
  public readonly selectedChange: EventEmitter<OptionComponent<ValueType>> = new EventEmitter<
    OptionComponent<ValueType>
  >();

  public selected = false;

  constructor(private readonly _elementRef: ElementRef<HTMLElement>) {}

  public ngOnInit(): void {
    if (!this.value) {
      this.value = this._elementRef.nativeElement.textContent as unknown as ValueType;
    }
  }

  @HostListener('click', ['$event'])
  public select(event: MouseEvent): void {
    if (!this.disabled && !this.selected) {
      this.selected = true;
      this.selectedChange.emit(this);
    }

    event.stopPropagation();
    event.stopImmediatePropagation();
  }
}

@NgModule({
  declarations: [OptionComponent],
  exports: [OptionComponent],
})
export class OptionModule {}
