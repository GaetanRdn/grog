import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  NgModule,
  NgZone,
  Optional,
  Output,
  QueryList,
} from '@angular/core';
import { OptionComponent, OptionModule } from '../option/option.component';
import { MaterialIconModule } from '@grorg/atoms/icons';
import { CommonModule } from '@angular/common';
import { defer, merge, Observable } from 'rxjs';
import { startWith, switchMap, take, tap } from 'rxjs/operators';
import { BooleanInput, EqualsFn, Nullable, OnChangeFn, OnTouchedFn, TypedControlValueAccessor } from '@grorg/types';
import { NgControl } from '@angular/forms';
import { CoerceBoolean } from '@grorg/decorators';
import { slideDownUp } from '@grorg/atoms/animations';

// TODO handle multiple selection
// TODO revoir la bordure en selected
@Component({
  selector: 'gro-select',
  animations: [slideDownUp],
  template: ` <div class="gro-select-wrapper">
      <span>{{ viewValue }}</span>
      <gro-material-icon>expand_more</gro-material-icon>
    </div>
    <div class="gro-options-wrapper" [style.height.rem]="panelHeight" *ngIf="opened" @slideDownUp>
      <ng-content></ng-content>
    </div>`,
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent<ValueType> implements AfterContentInit, TypedControlValueAccessor<ValueType> {
  static ngAcceptInputType_disabled: BooleanInput;

  @Input()
  public placeholder?: string;

  @Input()
  public value: Nullable<ValueType> = null;

  @Output()
  public readonly valueChange: EventEmitter<Nullable<ValueType>> = new EventEmitter<Nullable<ValueType>>();

  @ContentChildren(OptionComponent)
  public readonly options!: QueryList<OptionComponent<ValueType>>;

  @HostBinding('class.gro-opened')
  public opened = false;

  private readonly _selectionChange$: Observable<OptionComponent<ValueType>> = defer(() => {
    const options = this.options;

    if (options) {
      return options.changes.pipe(
        startWith(options),
        switchMap(() => merge(...options.map((option) => option.selectedChange)))
      );
    }

    return this._ngZone.onStable.pipe(
      take(1),
      switchMap(() => this._selectionChange$)
    );
  });

  constructor(
    private readonly _elementRef: ElementRef,
    private readonly _ngZone: NgZone,
    private readonly _cdr: ChangeDetectorRef,
    @Optional() private readonly _ngControl: NgControl
  ) {
    if (_ngControl) {
      _ngControl.valueAccessor = this;
    }
  }

  private _disabled = false;

  get disabled(): boolean {
    return this._disabled || Boolean(this._ngControl?.disabled);
  }

  @HostBinding('class.gro-disabled')
  @Input()
  @CoerceBoolean()
  set disabled(disabled: boolean) {
    this._disabled = disabled;
  }

  private _viewValue: Nullable<string> = null;

  get viewValue(): string {
    return this._viewValue ?? this.placeholder ?? '';
  }

  get panelHeight(): number {
    return this.options.toArray().length * 4;
  }

  @Input()
  public equals: EqualsFn<Nullable<ValueType>> = (opt1: Nullable<ValueType>, opt2: Nullable<ValueType>): boolean =>
    opt1 === opt2;

  @HostListener('click')
  public openPanel(): void {
    if (!this.disabled) {
      this.opened = true;
    }
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(event: EventTarget): void {
    if (!this.disabled && !this._elementRef.nativeElement.contains(event)) {
      this.opened = false;
    }
  }

  public ngAfterContentInit(): void {
    this._selectionChange$
      .pipe(
        tap((option: OptionComponent<ValueType>) =>
          this.options
            .toArray()
            .filter((opt: OptionComponent<ValueType>) => !this.equals(opt.value, option.value))
            .forEach((opt: OptionComponent<ValueType>) => (opt.selected = false))
        ),
        tap(() => (this.opened = false)),
        tap((option: OptionComponent<ValueType>) => (this._viewValue = option.value as unknown as string)),
        tap((option: OptionComponent<ValueType>) => (this.value = option.value)),
        tap(() => this.valueChange.emit(this.value)),
        tap(() => this._onChange(this.value)),
        tap(() => this._onTouched())
      )
      .subscribe(() => this._cdr.markForCheck());

    if (this.value) {
      this._viewValue = this.value as unknown as string;
      const found: OptionComponent<ValueType> | undefined = this.options.find((option: OptionComponent<ValueType>) =>
        this.equals(option.value, this.value)
      );

      if (found) {
        Promise.resolve().then(() => (found.selected = true));
      }
    }
  }

  public registerOnChange(fn: OnChangeFn<ValueType>): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: OnTouchedFn): void {
    this._onTouched = fn;
  }

  public writeValue(value: Nullable<ValueType>): void {
    this.value = value;
    this._viewValue = value as unknown as string;

    Promise.resolve().then(() => {
      const found: OptionComponent<ValueType> | undefined = this.options.find((option: OptionComponent<ValueType>) =>
        this.equals(option.value, this.value)
      );

      if (found) {
        found.selected = true;
      }
    });
  }

  private _onChange: OnChangeFn<ValueType> = () => ({});

  private _onTouched: OnTouchedFn = () => ({});
}

@NgModule({
  declarations: [SelectComponent],
  exports: [SelectComponent, OptionModule],
  imports: [MaterialIconModule, CommonModule],
})
export class SelectModule {}
