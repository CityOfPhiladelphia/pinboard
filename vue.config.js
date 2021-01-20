module.exports = {
  chainWebpack: (config) => {
    config.resolve.symlinks(false);
  },
  lintOnSave: true,
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/scss/_variables.scss";
          @import "@/scss/_mixins.scss";
        `,
        data: `
          @import "~@phila/phila-ui/src/assets/styles/scss/functions.scss";
          @import "~@phila/phila-ui/src/assets/styles/scss/colors.scss";
          @import "~@phila/phila-ui/src/assets/styles/scss/variables.scss";
        `,
      },
    },
  },
  assetsDir: 'static',
};
