const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');

const extractScss = new ExtractTextPlugin('../lib/core/prebuilt-themes/[name].css');
const libDir = '../alfresco-ng2-components/lib';

module.exports = {

    entry: {
        'adf-blue-orange': `${libDir}/core/styles/prebuilt/adf-blue-orange.scss`,
        'adf-blue-purple': `${libDir}/core/styles/prebuilt/adf-blue-purple.scss`,
        'adf-cyan-orange': `${libDir}/core/styles/prebuilt/adf-cyan-orange.scss`,
        'adf-cyan-purple': `${libDir}/core/styles/prebuilt/adf-cyan-purple.scss`,
        'adf-green-purple': `${libDir}/core/styles/prebuilt/adf-green-purple.scss`,
        'adf-green-orange': `${libDir}/core/styles/prebuilt/adf-green-orange.scss`,
        'adf-pink-bluegrey': `${libDir}/core/styles/prebuilt/adf-pink-bluegrey.scss`,
        'adf-indigo-pink': `${libDir}/core/styles/prebuilt/adf-indigo-pink.scss`,
        'adf-purple-green': `${libDir}/core/styles/prebuilt/adf-purple-green.scss`
    },

    resolve: {
        extensions: ['.ts', '.js'],
        modules: [path.resolve(__dirname, '../node_modules')]
    },

    output: {
        filename: '../dist/styles/[name].js'
    },

    module: {
        rules: [{
            test: /\.scss$/,
            use: extractScss.extract([{
                loader: "raw-loader"
            }, {
                loader: "sass-loader"
            }])
        }]
    },
    plugins: [
        extractScss
    ]
};
