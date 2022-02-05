module.exports = {
  stories: [],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-jest',
    {
      name: '@storybook/addon-storysource',
      options: {
        loaderOptions: {
          injectStoryParameters: false,
        },
      },
    },
  ],
  core: {
    builder: 'webpack5',
  },
  webpackFinal: (config) => {
    return config;
  },
};
