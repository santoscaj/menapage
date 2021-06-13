
require('dotenv').config()
module.exports = {
    // ...other vue-cli plugin options...
    // outputDir: process.env.VUE_APP_OUTDIR,
    outputDir:path.resolve("/var/www/html/gaminob.santosaj.com"),
    pwa: {
      themeColor: '#FFA400',
      msTileColor: '#000000',
      iconPaths: {
        msTileImage: 'img/icons/mstile-150x150.png'
      }
    },
  }
