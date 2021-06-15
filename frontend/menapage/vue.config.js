
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
        
    // chainWebpack: config => {
    //   // remove vue-cli-service's progress output
    //   config.plugins.delete('progress')
    // },
  }
