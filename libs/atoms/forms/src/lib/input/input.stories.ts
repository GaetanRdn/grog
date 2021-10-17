import { Meta, Story } from '@storybook/angular';
import { InputDirective } from './input.directive';

export default {
  title: 'atoms/forms/input',
  argTypes: {
    value: { control: { type: 'text' } },
    valueChange: { action: 'valueChange' },
  },
  component: InputDirective,
  parameters: {
    jest: ['input.directive.spec.ts'],
  },
} as Meta<InputDirective<unknown>>;

const BasicTemplate: Story<InputDirective<unknown>> = (args) => ({
  props: {
    ...args,
  },
  template: `<input groInput [value]='value' (valueChange)='valueChange($event)' [disabled]='disabled' [readonly]='readonly'/>`,
});

export const Default = BasicTemplate.bind({});
Default.args = {
  value: '',
  disabled: false,
  readonly: false,
};
