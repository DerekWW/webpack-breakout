const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: 'build/'
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.js$/
      },
      {
        use: ExtractTextPlugin.extract({
          use: 'css-loader'
        }),
        test: /\.css$/
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 40000 }
          },
          'image-webpack-loader'
        ]
      },
      //  {
      //   use: ExtractTextPlugin.extract({
      //       use: [{
      //           loader: "css-loader" // translates CSS into CommonJS
      //       }, {
      //           loader: "sass-loader" // compiles Sass to CSS
      //       }]
      //   }),
      //     test: /\.scss$/,
      //   }
    ]
  },
  plugins: [
    new ExtractTextPlugin('style.css')
  ]


}

module.exports = config
