module.exports = {
  chainWebpack: (config) => {
    config.resolve.symlinks(false);
  },
  lintOnSave: true,
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/scss/_variables.scss";
              @import "@/scss/_mixins.scss";`,
      },
    },
  },
  assetsDir: 'static',
};
