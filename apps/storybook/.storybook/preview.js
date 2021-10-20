import { withTests } from '@storybook/addon-jest';
import { setCompodocJson } from '@storybook/addon-docs/angular';

import results from '../../../.jest-test-results.json';
import docJson from '../../../dist/compodoc/storybook/documentation.json';

export const decorators = [
  withTests({
    results,
    filesExt: '((\\.specs?)|(\\.tests?))?(\\.ts)?$',
  }),
];

setCompodocJson(docJson);
