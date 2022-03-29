import { Args, Meta, moduleMetadata, Story } from '@storybook/angular';
import { OptionComponent, OptionModule } from './option.component';

export default {
  component: OptionComponent,
  title: 'atoms/forms/option',
  decorators: [
    moduleMetadata({
      imports: [OptionModule],
    }),
  ],
  argTypes: { selectedChange: { action: 'clicked' } },
} as Meta<OptionComponent<string>>;

const template: Story = (args: Args) => ({
  props: {
    disabled: Boolean(args['disabled']),
  },
  template: `<gro-option (selectedChange)="selectedChange" [disabled]="disabled">Option</gro-option>`,
});

export const Default = template.bind({});

export const Disabled = template.bind({});
Disabled.args = {
  disabled: true,
};
