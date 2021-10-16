import { Component, OnDestroy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CheckboxComponent } from './checkbox.component';
import { TemplateLookup } from '@grorg/tests';

describe('CheckboxComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckboxComponent,
        BasicHostComponent,
        ReadonlyHostComponent,
        DisabledHostComponent,
        ReactiveFormHostComponent,
      ],
      imports: [ReactiveFormsModule],
      providers: [CheckboxComponent],
    });
  });

  describe('Basic checkbox', () => {
    let templateLookup: TemplateLookup<BasicHostComponent>;

    beforeEach(() => {
      templateLookup = new TemplateLookup<BasicHostComponent>(
        TestBed.createComponent(BasicHostComponent)
      );
    });

    test.each(['val1', '2'])('should create with value %s', (value: string) => {
      // GIVEN
      templateLookup.hostComponent.checkboxValue = value;

      // WHEN
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(templateLookup.query<HTMLInputElement>('input').value).toEqual(
        value
      );
    });

    test('should emit value on check', () => {
      // GIVEN
      templateLookup.hostComponent.checkboxValue = 'val';
      templateLookup.hostComponent.checked = false;
      expect(templateLookup.hostComponent.currentValue).toBeNull();
      templateLookup.detectChanges();

      // WHEN
      templateLookup.query<HTMLInputElement>(CheckboxComponent).click();
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(templateLookup.hostComponent.currentValue).toEqual('val');
    });

    test('should emit null on uncheck', () => {
      // GIVEN
      templateLookup.hostComponent.checkboxValue = 'val';
      templateLookup.hostComponent.currentValue = 'val';
      templateLookup.hostComponent.checked = true;
      templateLookup.detectChanges();

      // WHEN
      templateLookup.query<HTMLInputElement>(CheckboxComponent).click();
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(templateLookup.hostComponent.currentValue).toBeNull();
    });

    test('check OnDestroy', () => {
      // GIVEN
      const checkbox: CheckboxComponent<string> = templateLookup
        .get('input')
        .injector.get(CheckboxComponent);
      jest.spyOn(checkbox.valueChange, 'unsubscribe');

      // WHEN
      (checkbox as unknown as OnDestroy).ngOnDestroy();

      // THEN
      expect(checkbox.valueChange.unsubscribe).toBeCalled();
    });
  });

  describe('Readonly checkbox', () => {
    let templateLookup: TemplateLookup<ReadonlyHostComponent>;

    beforeEach(() => {
      templateLookup = new TemplateLookup<ReadonlyHostComponent>(
        TestBed.createComponent(ReadonlyHostComponent)
      );

      templateLookup.detectChanges();
    });

    test('check does not emit value', () => {
      // GIVEN
      const checkbox: CheckboxComponent<string> = templateLookup
        .get('input')
        .injector.get(CheckboxComponent);
      jest.spyOn(checkbox.valueChange, 'emit');

      // WHEN
      templateLookup.query<HTMLInputElement>(CheckboxComponent).click();
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(checkbox.valueChange.emit).not.toBeCalled();
    });
  });

  describe('Disabled checkbox', () => {
    let templateLookup: TemplateLookup<DisabledHostComponent>;

    beforeEach(() => {
      templateLookup = new TemplateLookup<DisabledHostComponent>(
        TestBed.createComponent(DisabledHostComponent)
      );

      templateLookup.detectChanges();
    });

    test('check does not emit value', () => {
      // GIVEN
      const checkbox: CheckboxComponent<string> = templateLookup
        .get('input')
        .injector.get(CheckboxComponent);
      jest.spyOn(checkbox.valueChange, 'emit');

      // WHEN
      templateLookup.query<HTMLInputElement>(CheckboxComponent).click();
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(checkbox.valueChange.emit).not.toBeCalled();
    });
  });

  describe('ReactiveForm checkbox', () => {
    let templateLookup: TemplateLookup<ReactiveFormHostComponent>;

    beforeEach(() => {
      templateLookup = new TemplateLookup<ReactiveFormHostComponent>(
        TestBed.createComponent(ReactiveFormHostComponent)
      );

      templateLookup.detectChanges();
    });

    test('should create checked', () => {
      // GIVEN
      const checkbox: CheckboxComponent<string> = templateLookup
        .get('input')
        .injector.get(CheckboxComponent);

      // WHEN
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(checkbox.value).toEqual(
        templateLookup.hostComponent.control.value
      );
    });

    test('should create unchecked', () => {
      // GIVEN
      const checkbox: CheckboxComponent<string> = templateLookup
        .get('input')
        .injector.get(CheckboxComponent);
      templateLookup.hostComponent.control.setValue(null);

      // WHEN
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(checkbox.value).toEqual('val');
    });

    test('check is touched on change', () => {
      // WHEN
      templateLookup.query<HTMLInputElement>(CheckboxComponent).click();
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });

    test('check control value on change', () => {
      // WHEN
      templateLookup.query<HTMLInputElement>(CheckboxComponent).click();
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.hostComponent.control.value).toBeNull();
    });

    test('should create disabled', () => {
      // GIVEN
      templateLookup.hostComponent.control.disable();

      // WHEN
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });
  });
});

@Component({
  template: `<adr-checkbox
    value="{{ checkboxValue }}"
    (valueChange)="currentValue = $event"
    [checked]="checked"
    >Basic</adr-checkbox
  >`,
})
class BasicHostComponent {
  public checkboxValue!: any;

  public currentValue: any = null;

  public checked = false;
}

@Component({
  template: ` <adr-checkbox [value]="'val'" readOnly>ReadOnly</adr-checkbox>`,
})
class ReadonlyHostComponent {}

@Component({
  template: `<adr-checkbox [value]="'val'" disabled>Disabled</adr-checkbox>`,
})
class DisabledHostComponent {}

@Component({
  template: `<adr-checkbox [value]="'val'" [formControl]="control"
    >Reactive</adr-checkbox
  >`,
})
class ReactiveFormHostComponent {
  public control: FormControl = new FormControl('val');
}
