const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin;
const TerserPlugin = require('terser-webpack-plugin');
const BUILD_PATH = process.env.BUILD_PATH;

console.log(process.env.BUILD_PATH);

module.exports = {
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
        chunkFilename: '[name].chunk.js',
        publicPath: BUILD_PATH
    },
    externals:{
        moment: 'moment'
    },
    resolve:{
        alias:{
            vue$: 'vue/dist/vue.esm-bundler.js'
        },
        extensions: [
            '.js',
            '.vue'
        ],
    },
    module:{
        noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
        rules:[
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'vue-loader' // allows usage of SFC
                }]
            },
            {
                test: /\.js$/,
                use:[{
                    loader: 'babel-loader' // allows ES6+ syntax
                }],
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        arrows: false,
                        collapse_vars: false,
                        comparisons: false,
                        computed_props: false,
                        hoist_funs: false,
                        hoist_props: false,
                        hoist_vars: false,
                        inline: false,
                        loops: false,
                        negate_iife: false,
                        properties: false,
                        reduce_funcs: false,
                        reduce_vars: false,
                        switches: false,
                        toplevel: false,
                        typeofs: false,
                        booleans: true,
                        if_return: true,
                        sequences: true,
                        unused: true,
                        conditionals: true,
                        dead_code: true,
                        evaluate: true
                    },
                    mangle: {
                        safari10: true
                    }
                },
                sourceMap: true,
                cache: true,
                parallel: true,
                extractComments: false
            })
        ]
    },
    plugins:[
        new VueLoaderPlugin()
    ]
}