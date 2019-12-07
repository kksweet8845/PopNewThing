/**
 * This webpack file serve the purpose of bundling server js files.
 * This file should remain untoched, unless you know wath you are doing.
 * Also, only use commonJs syntax in this file.
 * DO NOT use any other transformer for unnecessary burden
 */

 const path = require('path')
 const nodeExternals = require('webpack-node-externals')
 const config = require('./config')

 const isDevMode = process.env.NODE_ENV === 'development'

 module.exports = {
     devtool: isDevMode ? 'inline-sourcemap' : false,
     mode   : isDevMode ? 'development' : 'production',
     entry  : [
         'babel-polyfill',
         path.join(config.projectRoot, 'server.js'),
     ],
     output : {
         path   : path.join(config.projectRoot, 'bin'),
         filename: 'server.bundle.js',
     },
     target : 'node',
     externals : [nodeExternals(), ],
     resolve: {
         alias: {
             'projectRoot' : config.projectRoot
         },
     },
     module : {
         rules: [
             {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use:   [
                    {
                        loader : 'babel-loader',
                        options : {
                            cacheDirectory : true,
                            presets        : ['@babel/preset-env', ],
                            babelrc        : false,
                        }
                    },
                ],
            }
         ]
     }
 }