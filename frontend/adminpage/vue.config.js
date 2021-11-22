
require('dotenv').config()
module.exports = {
    outputDir: process.env.VUE_APP_ADMIN_OUTDIR,
    // outputDir: "/var/www/html/admin-gaminob.santosaj.com",
    
    devServer: {
      // remove vue-cli-service's progress output
      progress: false,
      port: 8000,
    }, 

    // configureWebpack: {
    //   optimization: {
    //     // No need for splitting  
    //     splitChunks: false,
    //     minimize: true,
    //     // rest of the options for the minimized production versions
    //     // found on https://stackoverflow.com/questions/57443710/minification-of-vue-project
    //     minimizer: [
    //       new TerserPlugin({
    //         terserOptions: {
    //           ecma: undefined,
    //           warnings: false,
    //           parse: {},
    //           compress: {},
    //           mangle: true, // Note `mangle.properties` is `false` by default.
    //           module: false,
    //           output: null,
    //           toplevel: false,
    //           nameCache: null,
    //           ie8: false,
    //           keep_classnames: undefined,
    //           keep_fnames: false,
    //           safari10: false,
    //         },
    //       }),
    //     ],
    //   }
    // },

  }
