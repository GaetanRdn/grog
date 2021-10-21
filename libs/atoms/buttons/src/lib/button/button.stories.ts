import { Meta, Story } from '@storybook/angular';
import { ButtonDirective } from './button.directive';

export default {
  title: 'atoms/button',
  component: ButtonDirective,
  parameters: {
    jest: ['button.directive.spec.ts'],
  },
  argTypes: {
    color: {
      options: ['primary', 'accent', 'warn'],
      control: { type: 'radio' },
      defaultValue: 'primary',
    },
    size: {
      options: ['small', 'medium', 'large'],
      control: { type: 'radio' },
      defaultValue: 'medium',
    },
  },
} as Meta<ButtonDirective>;

const Template: Story<ButtonDirective> = (args: ButtonDirective) => ({
  props: args,
  template: `<button groButton [size]='size' [outlined]='outlined' [color]='color'>Click</button>`,
});

export const Default = Template.bind({});
Default.args = {
  size: 'medium',
  outlined: false,
  color: 'primary',
};
