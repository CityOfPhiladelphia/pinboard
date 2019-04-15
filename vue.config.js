const path = require('path')

module.exports = {
  lintOnSave: false,
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, './src/styles/global.scss'),
        path.resolve(__dirname, './node_modules/foundation-sites/foundation.scss'),

      ],
    },
  },
  css: {
    loaderOptions: {
      // pass options to sass-loader
      sass: {
        data: `
        @import "/node_modules/foundation-sites/foundation.scss";
      `,
      },
    },
  },
}
