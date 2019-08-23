const path = require("path");

module.exports = {
  devServer: {
      host : '15.164.153.221',
      port : 8080, 
      disableHostCheck : true
    },
  transpileDependencies: ['vue-clamp', 'resize-detector'],
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      patterns: [path.resolve(__dirname, "./src/styles/style.scss")]
    }
  },
  chainWebpack: (config) => {
    config.plugins.delete('preload')
  }
};
