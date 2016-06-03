'use strict';

var webpack = require('webpack'),
    path = require('path'),
    rootPath = path.join(__dirname),
    resourcesPath = path.join(rootPath, 'resources'),
    jsPath = path.join(resourcesPath, 'assets', 'js'),
    publicPath = path.join(rootPath, 'public'),
    publicJsPath = path.join(publicPath, 'js');

module.exports = {
    target: 'web',
    cache: true,
    entry: {
        app: path.join(jsPath, 'app.js'),
        common: [
            'axios',
            'react',
            'react-dnd',
            'react-dom',
            'react-dnd-html5-backend'
        ]
    },
    resolve: {
        root: rootPath,
        extensions: ['', '.js', '.jsx'],
    },
    output: {
        path: publicJsPath,
        publicPath: 'js',
        filename: '[name].js',
        library: ['TodoList', '[name]'],
        pathInfo: true
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel?cacheDirectory'
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('common', 'common.js'),
        new webpack.NoErrorsPlugin()
    ],
    debug: true,
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        contentBase: './public',
        historyApiFallback: true
    }
};
