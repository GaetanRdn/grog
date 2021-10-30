import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgModule,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { CoerceBoolean } from '@grorg/decorators';

// TODO externalize it into a library: utility types
type Nullable<Type> = Type | null;

@Component({
  selector: 'gro-select',
  host: {
    '[class.gro-opened]': 'isOpen || null',
    '[class.gro-disabled]': 'disabled || null',
    '[attr.required]': 'required || null',
  },
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent<ValueType> {
  @Input()
  public options: ValueType[] = [];

  @Input()
  public value: Nullable<ValueType> | ValueType[] = null;

  @Input()
  @CoerceBoolean()
  public required = false;

  @Input()
  @CoerceBoolean()
  public disabled = false;

  @Input()
  @CoerceBoolean()
  public multiple = false;

  @Output()
  public readonly valueChange: EventEmitter<Nullable<ValueType> | ValueType[]> = new EventEmitter<
    Nullable<ValueType> | ValueType[]
  >();

  private _isOpen = false;

  get isOpen(): boolean {
    return this._isOpen;
  }

  constructor(private _elementRef: ElementRef) {}

  public select(event: MouseEvent, option: ValueType): void {
    event.stopPropagation();

    if (this.required) {
      if (this.value !== option) {
        this.propagateChange(option);
      }
    } else {
      this.propagateChange(option === this.value ? null : option);
    }
  }

  @HostListener('click')
  private open(): void {
    if (!this.disabled) {
      this._isOpen = true;
    }
  }

  @HostListener('document:click', ['$event.target'])
  private onDocumentClick(event: EventTarget): void {
    if (!this._elementRef.nativeElement.contains(event)) {
      this._isOpen = false;
    }
  }

  private propagateChange(value: Nullable<ValueType>): void {
    this.value = value;
    this._isOpen = false;
    this.valueChange.emit(this.value);
  }
}

@NgModule({
  declarations: [SelectComponent],
  exports: [SelectComponent],
  imports: [CommonModule],
})
export class SelectModule {}
