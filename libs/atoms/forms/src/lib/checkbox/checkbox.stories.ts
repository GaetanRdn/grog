import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/angular';
import { CheckboxComponent } from '@grorg/atoms-forms';

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
  },
} as Meta<CheckboxComponent<string>>;

const basicTemplate: Story<CheckboxComponent<string>> = (
  args: CheckboxComponent<string>
) => ({
  template: `<adr-checkbox [value]="value" [checked]="checked" [disabled]="disabled" [readOnly]="readOnly" (valueChange)="valueChange($event)">{{ ngContent }}</adr-checkbox>`,
  props: {
    ...args,
    valueChange: action('valueChange'),
  },
});

export const basic = basicTemplate.bind({});
basic.args = {
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
  template: `<adr-checkbox [value]="value" [readOnly]="readOnly" [formControl]="control">{{ ngContent }}</adr-checkbox>`,
  props: {
    ...args,
    control: new FormControl(args.value),
  },
});

export const reactiveForms = reactiveTemplate.bind({});
reactiveForms.args = {
  readOnly: false,
  value: 'test',
};
