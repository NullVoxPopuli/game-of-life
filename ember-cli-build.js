/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
// const { prebuild } = require('@embroider/compat');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    // Add options here
    'ember-cli-babel': {
      enableTypeScriptTransform: true,
      disableDecoratorTransforms: true,
    },
    babel: {
      plugins: [
        // this is a better decorator transform than
        // the official babel one
        require.resolve('decorator-transforms'),
      ],
    },
  });

  // return prebuild(app);

  const { Webpack } = require('@embroider/webpack');

  return require('@embroider/compat').compatBuild(app, Webpack, {
    extraPublicTrees: [],
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
    staticAddonTrees: true,
    staticAddonTestSupportTrees: true,
    staticHelpers: true,
    staticModifiers: true,
    staticComponents: true,
    staticEmberSource: false,
    packagerOptions: {
      webpackConfig: {
        devtool: 'source-map',
      },
    },
  });
};
