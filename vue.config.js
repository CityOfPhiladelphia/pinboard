module.exports = {
  chainWebpack: (config) => {
    config.resolve.symlinks(false);
  },
  lintOnSave: true,
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "~@phila/phila-ui/src/assets/styles/scss/all.scss";
          @import "~@phila/phila-ui/src/assets/styles/scss/functions.scss";
          @import "~@phila/phila-ui/src/assets/styles/scss/colors.scss";
          @import "~@phila/phila-ui/src/assets/styles/scss/variables.scss";
        `,
        sourceMap: true,
      },
    },
  },
  assetsDir: 'static',
};
