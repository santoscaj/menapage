
require('dotenv').config()
module.exports = {
    // ...other vue-cli plugin options...
    outputDir: process.env.OUTDIR,
    pwa: {
      themeColor: '#FFA400',
      msTileColor: '#000000',
      iconPaths: {
        msTileImage: 'img/icons/mstile-150x150.png'
      }
    },
  }