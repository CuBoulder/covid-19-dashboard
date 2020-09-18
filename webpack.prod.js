const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
    entry: './index.js',
    mode: 'production',
    externals:{
        'vue' : 'Vue'
    },
    module:{
        rules: [
            {
                test: /\.css$/,
                use: [
                    {loader: MiniCssExtractPlugin.loader},
                    {loader: 'css-loader', options: {sourceMap:false}}
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    {loader: MiniCssExtractPlugin.loader},
                    {loader: 'css-loader', options: {sourceMap:false}},
                    {loader: 'sass-loader', options: {
                        additionalData: `@import "./global.scss";`
                    }}
                ]
            }
        ]
    },
    plugins:[
        new MiniCssExtractPlugin({
            filename: '[name].css',
        })
    ]
});