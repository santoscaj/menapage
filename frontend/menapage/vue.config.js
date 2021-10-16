
require('dotenv').config()

module.exports = {
    // ...other vue-cli plugin options...
    outputDir: process.env.VUE_APP_MENAPAGE_OUTDIR,
    // outputDir: "/var/www/html/gaminob.santosaj.com",
    pwa: {
      themeColor: '#FFA400',
      msTileColor: '#000000',
      iconPaths: {
        msTileImage: 'img/icons/mstile-150x150.png'
      }
    },

    devServer: {
      // remove vue-cli-service's progress output
      progress: false
    }, 

  //   configureWebpack: {
  //     optimization: {
  //       // No need for splitting  
  //       splitChunks: false,
  //       minimize: true,
  //       // rest of the options for the minimized production versions
  //       // found on https://stackoverflow.com/questions/57443710/minification-of-vue-project
  //       minimizer: [
  //         new TerserPlugin({
  //           terserOptions: {
  //             ecma: undefined,
  //             warnings: false,
  //             parse: {},
  //             compress: {},
  //             mangle: true, // Note `mangle.properties` is `false` by default.
  //             module: false,
  //             output: null,
  //             toplevel: false,
  //             nameCache: null,
  //             ie8: false,
  //             keep_classnames: undefined,
  //             keep_fnames: false,
  //             safari10: false,
  //           },
  //         }),
  //       ],
  //     }
  // },
   
    // chainWebpack: config => {
    //   // remove vue-cli-service's progress output
    //   config.plugins.delete('progress')
    // },
  }
