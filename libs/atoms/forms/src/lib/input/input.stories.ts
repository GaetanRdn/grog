import { Meta, Story } from '@storybook/angular';
import { screen, userEvent } from '@storybook/testing-library';
import { InputDirective } from './input.directive';

export default {
  title: 'atoms/forms/input',
  argTypes: {
    value: { control: { type: 'text' } },
    // valueChange: { action: 'valueChange' },
  },
  component: InputDirective,
  parameters: {
    jest: ['input.directive.spec.ts'],
    actions: { argTypesRegex: '^on.*' },
  },
} as Meta<InputDirective>;

const template: Story<InputDirective> = (args: InputDirective) => ({
  props: {
    ...args,
  },
  template: `<input data-testid="input" groInput [value]="value" [disabled]="disabled" [readonly]="readonly"/>`,
});

export const Default = template.bind({});
Default.args = {
  disabled: false,
  readonly: false,
};

export const Play = template.bind({});
Play.play = async () => {
  const input: HTMLInputElement = screen.getByTestId('input');

  await userEvent.type(input, 'hello', {
    delay: 100,
  });
};
