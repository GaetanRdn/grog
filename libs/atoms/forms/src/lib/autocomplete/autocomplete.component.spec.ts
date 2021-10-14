import { Component, DebugElement } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteComponent, AutocompleteModule } from './autocomplete.component';
import { TemplateLookup } from '@grorg/tests';
import { CreateOptionFn, DisplayFn, IdentityFn } from './autocomplete.models';

describe('AutocompleteComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        HostComponent,
        RequiredHostComponent,
        ObjectValueHostComponent,
        OpenOnInputHostComponent,
        DisabledHostComponent,
        ReactiveFormHostComponent,
        AddToOptionsIfNotFoundHostComponent,
      ],
      imports: [AutocompleteModule, ReactiveFormsModule],
    });
  });

  describe('Basic', () => {
    let templateLookup: TemplateLookup<HostComponent>;

    beforeEach(() => {
      templateLookup = new TemplateLookup<HostComponent>(
        TestBed.createComponent(HostComponent)
      );

      templateLookup.detectChanges();
    });

    test('should create', () => {
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });

    test('when focus then options panel is open', () => {
      // WHEN
      templateLookup.query('input').focus();
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });

    test('when click on option then panel is closed', () => {
      // GIVEN
      templateLookup.query('input').focus();
      templateLookup.detectChanges();

      // WHEN
      templateLookup.query('.adr-option:last-child').click();
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });

    test('when click on option then check value', () => {
      // GIVEN
      templateLookup.query('input').focus();
      templateLookup.detectChanges();

      // WHEN
      templateLookup.query('.adr-option').click();
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.getComponent(AutocompleteComponent).value).toEqual(
        'Gaetan'
      );
      expect(templateLookup.hostComponent.value).toEqual('Gaetan');
    });

    test('when click on selected option then value is null', () => {
      // GIVEN
      templateLookup.query('input').focus();
      templateLookup.detectChanges();

      // WHEN
      templateLookup.query('.adr-option.adr-selected').click();
      templateLookup.detectChanges();

      // THEN
      expect(
        templateLookup.getComponent(AutocompleteComponent).value
      ).toBeNull();
      expect(templateLookup.hostComponent.value).toBeNull();
    });

    test('when click outside then options panel is closed', () => {
      // GIVEN
      templateLookup.query('input').focus();
      templateLookup.detectChanges();

      // WHEN
      templateLookup.query('.outside').click();
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });

    test('when input value then displayed options are filtered', () => {
      // GIVEN
      const input: DebugElement = templateLookup.get('input');
      input.nativeElement.value = 'g';
      input.triggerEventHandler('input', { target: input.nativeElement });

      // WHEN
      templateLookup.query('input').focus();
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });
  });

  describe('Required', () => {
    let templateLookup: TemplateLookup<RequiredHostComponent>;

    beforeEach(() => {
      templateLookup = new TemplateLookup<RequiredHostComponent>(
        TestBed.createComponent(RequiredHostComponent)
      );

      templateLookup.detectChanges();
    });

    test('should create', () => {
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });

    test('when required and click on selected option then value does not change', () => {
      // GIVEN
      jest.spyOn(
        templateLookup.getComponent(AutocompleteComponent).valueChange,
        'emit'
      );
      templateLookup.query('input').focus();
      templateLookup.detectChanges();

      // WHEN
      templateLookup.query('.adr-option.adr-selected').click();
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(
        templateLookup.getComponent(AutocompleteComponent).valueChange.emit
      ).not.toBeCalled();
      expect(templateLookup.getComponent(AutocompleteComponent).value).toEqual(
        'Soren'
      );
      expect(templateLookup.hostComponent.value).toEqual('Soren');
    });
  });

  describe('Objects as values', () => {
    let templateLookup: TemplateLookup<ObjectValueHostComponent>;

    beforeEach(() => {
      templateLookup = new TemplateLookup<ObjectValueHostComponent>(
        TestBed.createComponent(ObjectValueHostComponent)
      );

      templateLookup.detectChanges();
    });

    test('should create', () => {
      // WHEN
      templateLookup.query('input').focus();
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });
  });

  describe('Open on input', () => {
    let templateLookup: TemplateLookup<OpenOnInputHostComponent>;

    beforeEach(() => {
      templateLookup = new TemplateLookup<OpenOnInputHostComponent>(
        TestBed.createComponent(OpenOnInputHostComponent)
      );

      templateLookup.detectChanges();
    });

    test('should not open on focus', () => {
      // WHEN
      templateLookup.query('input').focus();
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });

    test('should open on input with value', () => {
      // GIVEN
      const input: DebugElement = templateLookup.get('input');
      input.nativeElement.value = 's';
      templateLookup.detectChanges();

      // WHEN
      input.triggerEventHandler('input', { target: input.nativeElement });
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });
  });

  describe('Disabled', () => {
    let templateLookup: TemplateLookup<DisabledHostComponent>;

    beforeEach(() => {
      templateLookup = new TemplateLookup<DisabledHostComponent>(
        TestBed.createComponent(DisabledHostComponent)
      );

      templateLookup.detectChanges();
    });

    test('should create', () => {
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });

    test('should not open on focus', () => {
      // WHEN
      templateLookup.query('input').focus();
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });
  });

  describe('Reactive form', () => {
    let templateLookup: TemplateLookup<ReactiveFormHostComponent>;

    beforeEach(() => {
      templateLookup = new TemplateLookup<ReactiveFormHostComponent>(
        TestBed.createComponent(ReactiveFormHostComponent)
      );

      templateLookup.detectChanges();
    });

    test('should create', () => {
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });

    test('should update control on select', () => {
      // GIVEN
      templateLookup.query('input').focus();
      templateLookup.detectChanges();
      expect(templateLookup.firstChildElement).toMatchSnapshot();

      // WHEN
      templateLookup.query('.adr-option:not(.adr-selected)').click();
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(templateLookup.hostComponent.control.value).toEqual({
        id: 2,
        firstName: 'Gaetan',
      });
    });

    test('should be disabled', () => {
      // WHEN
      templateLookup.hostComponent.control.disable();
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });
  });

  describe('Create option if not found', () => {
    let templateLookup: TemplateLookup<AddToOptionsIfNotFoundHostComponent>;

    beforeEach(() => {
      templateLookup = new TemplateLookup<AddToOptionsIfNotFoundHostComponent>(
        TestBed.createComponent(AddToOptionsIfNotFoundHostComponent)
      );

      templateLookup.detectChanges();
    });

    test('should add option', () => {
      // GIVEN
      const input: DebugElement = templateLookup.get('input');
      input.nativeElement.value = 'Jojo';

      // WHEN
      input.triggerEventHandler('focus', { target: input.nativeElement });
      templateLookup.detectChanges();
      input.triggerEventHandler('blur', { target: input.nativeElement });
      templateLookup.detectChanges();

      // THEN
      // expect(templateLookup.hostComponent.value).toEqual('Jojo');
    });
  });
});

interface Person {
  id: number;
  firstName: string;
}

@Component({
  template: ` <adr-autocomplete
      [options]="options"
      [(value)]="value"
    ></adr-autocomplete>
    <span class="outside"></span>`,
})
class HostComponent {
  public options: string[] = ['Soren', 'Gaetan'];

  public value: string = 'Soren';
}

@Component({
  template: ` <adr-autocomplete
    [options]="options"
    [(value)]="value"
    disabled
  ></adr-autocomplete>`,
})
class DisabledHostComponent {
  public options: string[] = ['Soren', 'Gaetan'];

  public value: string = 'Soren';
}

@Component({
  template: ` <adr-autocomplete
    [options]="options"
    [(value)]="value"
    required
  ></adr-autocomplete>`,
})
class RequiredHostComponent extends HostComponent {}

@Component({
  template: ` <adr-autocomplete
    [options]="options"
    [(value)]="value"
    openOn="input"
  ></adr-autocomplete>`,
})
class OpenOnInputHostComponent extends HostComponent {}

@Component({
  template: ` <adr-autocomplete
    [options]="options"
    [(value)]="value"
    [createOptionFn]="createOptionFn"
  ></adr-autocomplete>`,
})
class AddToOptionsIfNotFoundHostComponent extends HostComponent {
  public createOptionFn: CreateOptionFn<string> = (input: string) => input;
}

@Component({
  template: ` <adr-autocomplete
      [options]="options"
      [(value)]="value"
      [displayOptionFn]="displayFn"
      required
    ></adr-autocomplete>
    <span class="outside"></span>`,
})
class ObjectValueHostComponent {
  public options: Person[] = [
    { id: 1, firstName: 'Soren' },
    { id: 2, firstName: 'Gaetan' },
  ];

  public value: Person = { id: 1, firstName: 'Soren' };

  public displayFn: DisplayFn<Person> = (option: Person): string =>
    option.firstName;
}

@Component({
  template: ` <adr-autocomplete
      [options]="options"
      [formControl]="control"
      [displayOptionFn]="displayFn"
      [identityFn]="identityFn"
    ></adr-autocomplete>
    <span class="outside"></span>`,
})
class ReactiveFormHostComponent {
  public options: Person[] = [
    { id: 1, firstName: 'Soren' },
    { id: 2, firstName: 'Gaetan' },
  ];

  public readonly control: FormControl = new FormControl({
    id: 1,
    firstName: 'Soren',
  });

  public identityFn: IdentityFn<Person> = (p: Person) => p.id;

  public displayFn: DisplayFn<Person> = (option: Person): string =>
    option.firstName;
}
