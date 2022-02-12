import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/angular';
import { CheckboxComponent } from './checkbox.component';

export default {
  title: 'atoms/forms/checkbox',
  component: CheckboxComponent,
  args: {
    ngContent: 'Check me',
  },
  argTypes: {
    value: { control: { type: 'text' } },
  },
  parameters: {
    jest: ['checkbox.component.spec.ts'],
    actions: { argTypesRegex: '^on.*' },
  },
} as Meta<CheckboxComponent<string>>;

const template: Story<CheckboxComponent<string>> = (
  args: CheckboxComponent<string>
) => ({
  template: `<gro-checkbox [value]="value" [checked]="checked" [disabled]="disabled" [readOnly]="readOnly" (valueChange)="valueChange($event)">{{ ngContent }}</gro-checkbox>`,
  props: {
    ...args,
    valueChange: action('valueChange'),
  },
});

export const Basic = template.bind({});
Basic.args = {
  checked: false,
  disabled: false,
  readOnly: false,
  value: 'test',
};

const reactiveTemplate: Story<CheckboxComponent<string>> = (
  args: CheckboxComponent<string>
) => ({
  moduleMetadata: {
    imports: [ReactiveFormsModule],
  },
  template: `<gro-checkbox [value]="value" [readOnly]="readOnly" [formControl]="control">{{ ngContent }}</gro-checkbox>`,
  props: {
    ...args,
    control: new FormControl(args.value),
    valueChange: action('valueChange'),
  },
});

export const ReactiveForms = reactiveTemplate.bind({});
ReactiveForms.args = {
  readOnly: false,
  value: 'test',
};
