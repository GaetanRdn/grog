import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/angular';
import { SelectComponent } from './select.component';

export default {
  title: 'atoms/forms/select',
  component: SelectComponent,
} as Meta<SelectComponent<unknown>>;

const template: Story<SelectComponent<unknown>> = (args) => ({
  props: {
    ...args,
    valueChange: action('log'),
  },
});

export const basic = template.bind({});
basic.args = {
  disabled: false,
  value: null,
  required: false,
  options: ['Option1', 'Option2', 'Option3'],
};
basic.argTypes = {
  value: {
    options: ['Option1', 'Option2', 'Option3'],
  },
};
