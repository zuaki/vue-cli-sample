const webpack = require('webpack');

// vue.config.js
module.exports = {
  outputDir: "dist",
  filenameHashing: false,
  
  /** 
   * webpackに外部プラグインを読み込ませる。
   * 参考：https://qiita.com/NoUkeNoLife/items/b5aa1934dc8c92459957
   */
  configureWebpack: {
    plugins: [
      // jQueryを別名($)で読み込ませている。jQueryのライブラリを使用するためにこうしておくと便利。
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        Popper: ['popper.js', 'default'],
      })
    ]
  }
}