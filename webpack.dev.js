const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {join} = require('path');

module.exports = merge(common, {
    entry: './index.js',
    mode: 'development',
    devServer:{
        port: 3000,
        contentBase: './public',
    },
    module:{
        rules:[
            {
                test: /\.css$/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader', options: {sourceMap:false}}
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: 'style-loader'},
                    { loader: 'css-loader', options: { sourceMap: false}},
                    { loader: 'sass-loader', options: {
                        additionalData: `@import "./global.scss";`
                    }}
                ]
            }
        ]
    },
    optimization:{
        splitChunks: {
            cacheGroups: {
                vendors: {
                    name: 'chunk-vendors',
                    test: /[\\\/]node_modules[\\\/]/,
                    priority: -10,
                    chunks: 'initial'
                },
                common: {
                    name: 'chunk-common',
                    minChunks: 2,
                    priority: -20,
                    chunks: 'initial',
                    reuseExistingChunk: true
                },
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                }
            }
        }
    },
    plugins:[
        new HTMLWebpackPlugin({
            showErrors: true,
            cache: true,
            template: join(__dirname, '/public/index.html')
        })
    ]
});