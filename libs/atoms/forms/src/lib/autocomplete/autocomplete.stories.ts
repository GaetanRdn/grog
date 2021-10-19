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
} as Meta<AutocompleteComponent<string>>;

const template: Story<AutocompleteComponent<string>> = (
  args: AutocompleteComponent<string>
) => ({
  moduleMetadata: {
    imports: [AutocompleteModule],
  },
  props: {
    ...args,
    valueChange: action('valueChange'),
  },
  template: `<gro-autocomplete [value]='value' [openOn]='openOn' [options]='options' [required]='required' [disabled]='disabled' (valueChange)='valueChange($event)'></gro-autocomplete>`,
});

export const basic = template.bind({});
basic.args = {
  options: ['Gaetan', 'Soren', 'Bernard'],
  value: '',
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
    ...args,
    valueChange: action('valueChange'),
    displayOptionFn: (option: Person): string =>
      `${option.firstName} - ${option.name}`,
  },
  template: `<gro-autocomplete [value]='value' [openOn]='openOn' [options]='options' [required]='required' [disabled]='disabled' (valueChange)='valueChange($event)' [displayOptionFn]='displayOptionFn'></gro-autocomplete>`,
});

export const complexValues = objectsValuesTemplate.bind({});
complexValues.args = {
  options: [
    { id: 1, firstName: 'Gaetan', name: 'Redin' },
    { id: 2, firstName: 'Soren', name: 'Redin' },
    { id: 3, firstName: 'Lord', name: 'Voldemor' },
  ],
  value: { id: 2, firstName: 'Soren', name: 'Redin' },
};

const reactiveFormTemplate: Story<AutocompleteComponent<Person>> = (
  args: AutocompleteComponent<Person>
) => ({
  moduleMetadata: {
    imports: [AutocompleteModule, ReactiveFormsModule],
  },
  props: {
    ...args,
    valueChange: action('valueChange'),
    value: null,
    displayOptionFn: (option: Person): string =>
      `${option.firstName} - ${option.name}`,
    control: new FormControl({ id: 2, firstName: 'Soren', name: 'Redin' }),
    identityFn: (p: Person): string | number => p.id ?? p.firstName + p.name,
  },
  template: `<gro-autocomplete [formControl]='control' [openOn]='openOn' [options]='options' [required]='required' (valueChange)='valueChange($event)' [displayOptionFn]='displayOptionFn' [identityFn]='identityFn'></gro-autocomplete>`,
});

export const reactiveForm = reactiveFormTemplate.bind({});
reactiveForm.args = {
  options: [
    { id: 1, firstName: 'Gaetan', name: 'Redin' },
    { id: 2, firstName: 'Soren', name: 'Redin' },
    { id: 3, firstName: 'Lord', name: 'Voldemor' },
  ],
};

const addOptionTemplate: Story<AutocompleteComponent<Person>> = (
  args: AutocompleteComponent<Person>
) => ({
  moduleMetadata: {
    imports: [AutocompleteModule, ReactiveFormsModule],
  },
  props: {
    ...args,
    valueChange: action('valueChange'),
    value: { id: 2, firstName: 'Soren', name: 'Redin' },
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
  template: `<gro-autocomplete [value]='value' [openOn]='openOn' [options]='options' [required]='required' (valueChange)='valueChange($event)' [displayOptionFn]='displayOptionFn' [createOptionFn]='createOptionFn' [identityFn]='identityFn'></gro-autocomplete>`,
});

export const addOption = addOptionTemplate.bind({});
addOption.args = {
  options: [
    { id: 1, firstName: 'Gaetan', name: 'Redin' },
    { id: 2, firstName: 'Soren', name: 'Redin' },
    { id: 3, firstName: 'Lord', name: 'Voldemor' },
  ],
};
