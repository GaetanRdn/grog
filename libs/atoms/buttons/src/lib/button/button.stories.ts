import { CommonModule } from '@angular/common';
import { Meta, Story } from '@storybook/angular';
import { ButtonDirective } from './button.directive';

export default {
  title: 'atoms/button',
  component: ButtonDirective,
  parameters: {
    jest: ['button.directive.spec.ts'],
  },
} as Meta<ButtonDirective>;

const Template: Story<ButtonDirective> = (args: ButtonDirective) => ({
  props: args,
  moduleMetadata: { declarations: [ButtonDirective], imports: [CommonModule] },
  template: `<button groButton [size]="size" [outlined]="outlined" [color]="color">Click</button>`,
});

export const Default = Template.bind({});
