import { Meta, Story } from '@storybook/angular';
import { ButtonDirective } from './button.directive';

export default {
  title: 'atoms/button',
  component: ButtonDirective,
  parameters: {
    jest: ['button.directive.spec'],
  },
  argTypes: {
    color: {
      control: { type: 'inline-radio' },
    },
    size: {
      control: { type: 'inline-radio' },
    },
  },
} as Meta<ButtonDirective>;

const template: Story<ButtonDirective> = (args: ButtonDirective) => ({
  props: {
    size: args.size,
    outlined: args.outlined,
    color: args.color,
  },
  template: `<button groButton [size]="size" [outlined]="outlined" [color]="color">Click</button>`,
});

export const Default = template.bind({});
