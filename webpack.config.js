const webpack = require('webpack');
const path = require('path');
const webpackMerge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader')
class MyPlugin {
  apply(compiler, compilation) {
    const { name } = this.constructor;
    compiler.hooks.compilation.tap(name, (compilation, { normalModuleFactory }) => {
      const handler = parser => {
        console.log(1);
        console.log(2);
      }
      normalModuleFactory.hooks.parser.for("javascript/auto").tap("DefinePlugin", handler);
      normalModuleFactory.hooks.parser.for("javascript/dynamic").tap("DefinePlugin", handler);
      normalModuleFactory.hooks.parser.for("javascript/esm").tap("DefinePlugin", handler);
    });
  }
}

const entrys = ['foo', 'index']
const defaultConfig = {
  mode: "development",
  devtool: "source-map",
  entry: `./src/main.js`,
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      // {
      //   test: /\.css$/,
      //   use: [
      //     'vue-style-loader',
      //     'css-loader'
      //   ]
      // }
    ],
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    },
    extensions: ['.js', '.json', '.vue'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    // 请确保引入这个插件！
    new VueLoaderPlugin()
  ]
}
module.exports = entrys.map((entry, index) => {
  const config = {
    output: {
      path: path.resolve(__dirname, `dist/${entry}`),
      filename: `${entry}.js`,
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        PAGE: entry
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, `./src/index.html`)
      }),
    ]
  }
  if (index === 0) {
    config.devServer = {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 9000,
    }
  }
  return webpackMerge.merge(defaultConfig, config);
})