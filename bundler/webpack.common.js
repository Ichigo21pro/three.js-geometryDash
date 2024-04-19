const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = (env, argv) => {
  return {
    entry: path.resolve(__dirname, '../www/scripts/three-scene.js'),
    output: {
      filename: 'bundle.[contenthash].js',
      path: path.resolve(__dirname, '../dist'),
      publicPath: argv.mode === 'production' && env.github === 'true' ? '/threejs-boilerplate/' : '/',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '../www/index.html'),
        minify: true,
        favicon: 'assets/icons/favicon.ico',
      }),
      new MiniCSSExtractPlugin(),
    ],
    module: {
      rules: [
        // HTML
        {
          test: /\.(html)$/,
          use: ['html-loader'],
        },

        // JS
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },

        // CSS
        {
          test: /\.css$/,
          use: [MiniCSSExtractPlugin.loader, 'css-loader'],
        },

        // Images
        {
          test: /\.(jpg|png|gif|svg|bin|ico|hdr)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'assets/images/',
                name: '[name].[ext]',
              },
            },
          ],
        },

        // Models
        {
          test: /\.(obj|glb|gltf|drc|mtl)$/i,
          use: {
            loader: 'file-loader',
            options: {
              outputPath: 'models/',
              name: '[name].[ext]',
            },
          },
        },

        // Shaders
        {
          test: /\.(glsl|vs|fs|vert|frag)$/,
          exclude: /node_modules/,
          use: ['raw-loader'],
        },

        // Fonts
        {
          test: /\.(ttf|eot|woff|woff2)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'assets/fonts/',
                name: '[name].[ext]',
              },
            },
          ],
        },

        // Audio
        {
          test: /\.(mp3|wav)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'audio/',
                name: '[name].[ext]',
              },
            },
          ],
        },
      ],
    },
  };
};
