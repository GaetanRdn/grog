import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/angular';
import {
  AutocompleteComponent,
  AutocompleteModule,
} from './autocomplete.component';

export default {
  title: 'atoms/forms/autocomplete',
  component: AutocompleteComponent,
  parameters: {
    jest: ['autocomplete.component.spec.ts'],
  },
  argTypes: {
    openOn: {
      options: ['focus', 'input'],
      control: { type: 'inline-radio' },
    },
  },
} as Meta<AutocompleteComponent<unknown>>;

const template: Story<AutocompleteComponent<string>> = (
  args: AutocompleteComponent<string>
) => ({
  moduleMetadata: {
    imports: [AutocompleteModule],
  },
  props: {
    value: args.value,
    required: args.required,
    openOn: args.openOn,
    disabled: args.disabled,
    valueChange: action('valueChange'),
    options: args.options,
  },
  template: `<gro-autocomplete data-testId="basic" [value]="value" [openOn]="openOn" [options]="options" [required]="required" [disabled]="disabled" (valueChange)="valueChange($event)"></gro-autocomplete>`,
});

export const Basic = template.bind({});
Basic.args = {
  options: ['Gaetan', 'Soren', 'Bernard'],
  value: '',
  openOn: 'focus',
  required: false,
  disabled: false,
};
Basic.argTypes = {
  value: {
    control: { type: 'text' },
  },
};

interface Person {
  id?: number;
  firstName: string;
  name: string;
}

const objectsValuesTemplate: Story<AutocompleteComponent<Person>> = (
  args: AutocompleteComponent<Person>
) => ({
  moduleMetadata: {
    imports: [AutocompleteModule],
  },
  props: {
    value: args.value,
    required: args.required,
    openOn: args.openOn,
    disabled: args.disabled,
    options: args.options,
    valueChange: action('valueChange'),
    displayOptionFn: (option: Person): string =>
      `${option.firstName} - ${option.name}`,
  },
  template: `<gro-autocomplete [value]="value" [openOn]="openOn" [options]="options" [required]="required" [disabled]="disabled" (valueChange)="valueChange($event)" [displayOptionFn]="displayOptionFn"></gro-autocomplete>`,
});

export const ComplexValues = objectsValuesTemplate.bind({});
ComplexValues.args = {
  options: [
    { id: 1, firstName: 'Gaetan', name: 'Redin' },
    { id: 2, firstName: 'Soren', name: 'Redin' },
    { id: 3, firstName: 'Lord', name: 'Voldemor' },
  ],
  value: { id: 2, firstName: 'Soren', name: 'Redin' },
  openOn: 'focus',
  required: false,
  disabled: false,
};

const reactiveFormTemplate: Story<AutocompleteComponent<Person>> = (
  args: AutocompleteComponent<Person>
) => ({
  moduleMetadata: {
    imports: [AutocompleteModule, ReactiveFormsModule],
  },
  props: {
    required: args.required,
    openOn: args.openOn,
    disabled: args.disabled,
    options: args.options,
    valueChange: action('valueChange'),
    displayOptionFn: (option: Person): string =>
      `${option.firstName} - ${option.name}`,
    control: new FormControl({ id: 2, firstName: 'Soren', name: 'Redin' }),
    identityFn: (p: Person): string | number => p.id ?? p.firstName + p.name,
  },
  template: `<gro-autocomplete [formControl]="control" [openOn]="openOn" [options]="options" [required]="required" (valueChange)="valueChange($event)" [displayOptionFn]="displayOptionFn" [identityFn]="identityFn"></gro-autocomplete>`,
});

export const ReactiveForm = reactiveFormTemplate.bind({});
ReactiveForm.args = {
  options: [
    { id: 1, firstName: 'Gaetan', name: 'Redin' },
    { id: 2, firstName: 'Soren', name: 'Redin' },
    { id: 3, firstName: 'Lord', name: 'Voldemor' },
  ],
  openOn: 'focus',
  required: false,
  disabled: false,
};

const addOptionTemplate: Story<AutocompleteComponent<Person>> = (
  args: AutocompleteComponent<Person>
) => ({
  moduleMetadata: {
    imports: [AutocompleteModule, ReactiveFormsModule],
  },
  props: {
    required: args.required,
    openOn: args.openOn,
    disabled: args.disabled,
    options: args.options,
    value: args.value,
    valueChange: action('valueChange'),
    displayOptionFn: (option: Person): string =>
      option.firstName + ' - ' + option.name,
    identityFn: (p: Person): string | number => p.id ?? p.firstName + p.name,
    createOptionFn: (input: string): Partial<Person> => {
      if (input.includes('-')) {
        return {
          firstName: input.split('-')[0].trim(),
          name: input.split('-')[1].trim(),
        } as Person;
      } else {
        return {
          firstName: input.split('-')[0].trim(),
        } as Person;
      }
    },
  },
  template: `<gro-autocomplete [value]="value" [openOn]="openOn" [options]="options" [required]="required" (valueChange)="valueChange($event)" [displayOptionFn]="displayOptionFn" [createOptionFn]="createOptionFn" [identityFn]="identityFn"></gro-autocomplete>`,
});

export const AddOption = addOptionTemplate.bind({});
AddOption.args = {
  options: [
    { id: 1, firstName: 'Gaetan', name: 'Redin' },
    { id: 2, firstName: 'Soren', name: 'Redin' },
    { id: 3, firstName: 'Lord', name: 'Voldemor' },
  ],
  openOn: 'focus',
  required: false,
  disabled: false,
  value: null,
};
