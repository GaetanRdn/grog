import { Component, DebugElement, OnDestroy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TemplateLookup } from '@grorg/tests';
import { InputDirective } from './input.directive';

describe('InputDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        InputDirective,
        BasicComponent,
        ReadonlyComponent,
        DisabledComponent,
        FormControlComponent,
      ],
      imports: [ReactiveFormsModule],
    });
  });

  describe('Basic input', () => {
    let templateLookup: TemplateLookup<BasicComponent>;

    beforeEach(() => {
      templateLookup = new TemplateLookup(
        TestBed.createComponent(BasicComponent)
      );
    });

    test('Check default state', () => {
      // WHEN
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });

    test.each(['value1', 'value2'])('should set value %s', (value: string) => {
      // GIVEN
      templateLookup.hostComponent.value = value;

      // WHEN
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(templateLookup.query<HTMLInputElement>('input').value).toEqual(
        value
      );
    });

    test.each(['value1', 'value2'])(
      'should update parent value on change, expect %s',
      (value: string) => {
        // GIVEN
        templateLookup.detectChanges();

        // WHEN
        triggerInputValue(templateLookup, value);
        templateLookup.detectChanges();

        // THEN
        expect(templateLookup.firstChildElement).toMatchSnapshot();
        expect(templateLookup.hostComponent.value).toEqual(value);
      }
    );

    test('check class on focus', () => {
      // GIVEN
      templateLookup.detectChanges();

      // WHEN
      const input: DebugElement = templateLookup.get('input');
      input.triggerEventHandler('focus', input.nativeElement);
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });

    test('when focused then check class on blur', () => {
      // GIVEN
      const input: DebugElement = templateLookup.get('input');
      input.triggerEventHandler('focus', input.nativeElement);
      templateLookup.detectChanges();

      // WHEN
      input.triggerEventHandler('blur', input.nativeElement);
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });

    test('check OnDestroy', () => {
      // GIVEN
      const input: InputDirective = templateLookup
        .get('input')
        .injector.get(InputDirective);
      jest.spyOn(input.valueChange, 'unsubscribe');

      // WHEN
      (input as unknown as OnDestroy).ngOnDestroy();

      // THEN
      expect(input.valueChange.unsubscribe).toBeCalled();
    });
  });

  describe('Readonly input', () => {
    let templateLookup: TemplateLookup<ReadonlyComponent>;

    beforeEach(() => {
      templateLookup = new TemplateLookup(
        TestBed.createComponent(ReadonlyComponent)
      );

      templateLookup.detectChanges();
    });

    test('do not emit change', () => {
      // WHEN
      triggerInputValue(templateLookup, 'value');
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(templateLookup.hostComponent.value).toBeNull();
    });

    test('when focus then check dont have focused class', () => {
      // GIVEN
      templateLookup.detectChanges();

      // WHEN
      const input: DebugElement = templateLookup.get('input');
      input.triggerEventHandler('focus', input.nativeElement);
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });
  });

  describe('Disabled input', () => {
    let templateLookup: TemplateLookup<DisabledComponent>;

    beforeEach(() => {
      templateLookup = new TemplateLookup(
        TestBed.createComponent(DisabledComponent)
      );

      templateLookup.detectChanges();
    });

    test('do not emit change', () => {
      // WHEN
      triggerInputValue(templateLookup, 'value');
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(templateLookup.hostComponent.value).toBeNull();
    });

    test('when focus then check dont have focused class', () => {
      // GIVEN
      templateLookup.detectChanges();

      // WHEN
      const input: DebugElement = templateLookup.get('input');
      input.triggerEventHandler('focus', input.nativeElement);
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });
  });

  describe('ReactiveForm input', () => {
    let templateLookup: TemplateLookup<FormControlComponent>;

    beforeEach(() => {
      templateLookup = new TemplateLookup(
        TestBed.createComponent(FormControlComponent)
      );

      templateLookup.detectChanges();
    });

    test('should create with formControl', () => {
      // WHEN
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(
        templateLookup.query<HTMLInputElement>(InputDirective).value
      ).toEqual('');
    });

    test('should set value from formControl', () => {
      // GIVEN
      templateLookup.hostComponent.control.setValue('test');

      // WHEN
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(
        templateLookup.query<HTMLInputElement>(InputDirective).value
      ).toEqual('test');
    });

    test('should set value to formControl', async () => {
      // GIVEN
      templateLookup.detectChanges();

      // WHEN
      triggerInputValue(templateLookup, 'toto');
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(templateLookup.hostComponent.control.value).toEqual('toto');
    });

    test('check class on focus', () => {
      // GIVEN
      templateLookup.detectChanges();

      // WHEN
      const input: DebugElement = templateLookup.get('input');
      input.triggerEventHandler('focus', input.nativeElement);
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });

    test('when control is disabled then check', () => {
      // GIVE
      templateLookup.hostComponent.control.disable();

      // WHEN
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });
  });
});

const triggerInputValue = (
  templateLookup: TemplateLookup<unknown>,
  value: string
): void => {
  const input: DebugElement = templateLookup.get('input');
  (input.nativeElement as HTMLInputElement).value = value;
  input.triggerEventHandler('input', { target: input.nativeElement });
};

@Component({
  template: `<input groInput [(value)]="value" />`,
})
class BasicComponent {
  public value!: string;
}

@Component({
  template: `<input groInput readonly [(value)]="value" />`,
})
class ReadonlyComponent {
  public value = null;
}

@Component({
  template: `<input groInput disabled [(value)]="value" />`,
})
class DisabledComponent {
  public value = null;
}

@Component({
  template: `<input groInput [formControl]="control" />`,
})
class FormControlComponent {
  public control: FormControl = new FormControl();
}
