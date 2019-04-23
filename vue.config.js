module.exports = {
  lintOnSave: undefined,
  // css: {
  //   loaderOptions: {
  //     sass: {
  //       data: `@import "@/scss/global.scss;
  //               @import "src/scss/basic/_colors.scss"`,
  //     },
  //   },
  // },

  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/scss/global.scss";',
      },
    },
  },

  // pluginOptions: {
  // //   'style-resources-loader': {
  // //     preProcessor: 'scss',
  // //     patterns: [
  // //       path.resolve(__dirname, '@/styles/global.scss'),
  // //     ],
  // //   },
  // // },
  // },
  assetsDir: 'static',

}
