const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const json5 = require('json5');

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 8090,
    open: 'chrome',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.json5$/i,
        type: 'json',
        parser: {
          parse: json5.parse,
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
      favicon: './src/favicon.svg',
    }),
  ],
};
