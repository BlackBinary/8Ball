const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const outDir = path.resolve(__dirname, 'dist');

const production = process.env.NODE_ENV === 'PRODUCTION';

module.exports = {
  mode: production ? 'prouction' : 'development',
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: outDir,
  },
  devServer: {
    contentBase: outDir,
    hot: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: '8Ball',
    }),
  ],
};