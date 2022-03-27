import { componentWrapperDecorator, Meta, Story } from '@storybook/angular';
import { ButtonDirective } from './button.directive';

export default {
  title: 'atoms/button',
  component: ButtonDirective,
  parameters: {
    jest: ['button.directive.spec'],
  },
  decorators: [
    componentWrapperDecorator(
      (story) =>
        `<div style="display: grid;grid-template-columns: 1fr 1fr 1fr; grid-auto-flow: row dense; place-items: center; gap: 16px;">${story}</div>`
    ),
  ],
} as Meta<ButtonDirective>;

const templateForBasic: Story<ButtonDirective> = () => ({
  template: `
<button groButton size="small">Button</button>
<button groButton size="medium">Button</button>
<button groButton size="large">Button</button>
<button groButton size="small" color="primary">Button</button>
<button groButton size="medium" color="primary">Button</button>
<button groButton size="large" color="primary">Button</button>
<button groButton size="small" color="accent">Button</button>
<button groButton size="medium" color="accent">Button</button>
<button groButton size="large" color="accent">Button</button>
<button groButton size="small" color="error">Button</button>
<button groButton size="medium" color="error">Button</button>
<button groButton size="large" color="error">Button</button>`,
});

export const Basic = templateForBasic.bind({});

const templateForRaised: Story<ButtonDirective> = () => ({
  template: `
<button groRaisedButton size="small">Button</button>
<button groRaisedButton size="medium">Button</button>
<button groRaisedButton size="large">Button</button>
<button groRaisedButton size="small" color="primary">Button</button>
<button groRaisedButton size="medium" color="primary">Button</button>
<button groRaisedButton size="large" color="primary">Button</button>
<button groRaisedButton size="small" color="accent">Button</button>
<button groRaisedButton size="medium" color="accent">Button</button>
<button groRaisedButton size="large" color="accent">Button</button>
<button groRaisedButton size="small" color="error">Button</button>
<button groRaisedButton size="medium" color="error">Button</button>
<button groRaisedButton size="large" color="error">Button</button>`,
});

export const Raised = templateForRaised.bind({});
