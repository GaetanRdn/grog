import { Nullable } from '@grorg/types';
import { action } from '@storybook/addon-actions';
import { Args, Meta, moduleMetadata, Story } from '@storybook/angular';
import { RadioComponent } from './radio.component';
import { RadiosGroupComponent } from './radios-group.component';
import { RadiosModule } from './radios.module';

export default {
  title: 'atoms/forms/radios',
  component: RadiosGroupComponent,
  subcomponents: { RadioComponent },
  decorators: [moduleMetadata({ imports: [RadiosModule] })],
} as Meta;

const template: Story = (args: Args) => ({
  props: {
    value: args['value'],
    valueChange: action('log'),
    vertical: Boolean(args['vertical']),
    class: args['class'] ? 'gro-' + args['class'] : null,
  },
  template: `<gro-radios-group name="yesOrNo" [value]="value" (valueChange)="valueChange($event)" [vertical]="vertical" class="{{class}}">
<gro-radio [value]="1">Yes</gro-radio>
<gro-radio [value]="0">No</gro-radio>
</gro-radios-group>`,
});

export const Default = template.bind({});
Default.args = {
  class: 'primary',
};
Default.argTypes = {
  class: {
    options: [
      'primary',
      'primary-light',
      'primary-dark',
      'accent',
      'accent-light',
      'accent-dark',
      'warn',
      'warn-light',
      'warn-dark',
    ],
    control: { type: 'select' },
  },
};

export const Vertical = template.bind({});
Vertical.args = {
  vertical: true,
};

export const WithGroupValue = template.bind({});
WithGroupValue.args = {
  value: 1,
};

const templateWithCheckedRadio: Story = (args: Args) => ({
  props: {
    value: args['value'],
    valueChange: action('log'),
  },
  template: `<gro-radios-group name="yesOrNo" [value]="value" (valueChange)="valueChange($event)">
<gro-radio [value]="1">Yes</gro-radio>
<gro-radio [value]="0" checked>No</gro-radio>
</gro-radios-group>`,
});
export const WithCheckedRadio = templateWithCheckedRadio.bind({});
WithCheckedRadio.args = {
  value: null,
};

const templateWithObjectValue: Story = (args: Args) => ({
  props: {
    value: args['value'],
    equalsFn: (val1: Nullable<{ id: number; name: string }>, val2: Nullable<{ id: number; name: string }>) =>
      val1?.id === val2?.id,
    valueChange: action('log'),
  },
  template: `<gro-radios-group name="yesOrNo" [value]="value" [equalsFn]="equalsFn" (valueChange)="valueChange($event)">
<gro-radio [value]="{ id: 1, name: 'yes' }">Yes</gro-radio>
<gro-radio [value]="{ id: 2, name: 'no' }">No</gro-radio>
</gro-radios-group>`,
});
export const WithObjectValue = templateWithObjectValue.bind({});
WithObjectValue.args = {
  value: { id: 1, name: 'yes' },
};
