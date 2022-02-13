import { withTests } from '@storybook/addon-jest';
import 'cypress-storybook/angular';

import { setCompodocJson } from '@storybook/addon-docs/angular';

try {
  const doc = require('../documentation.json');
  setCompodocJson(doc);
} catch (e) {
  console.warn('No documentation found');
}

let results = null;
try {
  results = require('../.jest-test-results.json');
} catch (e) {
  console.warn('No unit test found');
}

export const decorators = [
  withTests({
    results,
    filesExt: '((\\.specs?)|(\\.tests?))?(\\.ts)?$',
  }),
];
