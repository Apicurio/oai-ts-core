var webpack = require("webpack"),
    path = require("path"),
    yargs = require("yargs");

var libraryName = "OAI",
    plugins = [],
    outputFile;

if (yargs.argv.p) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
    outputFile = libraryName + ".min.js";
} else {
    outputFile = libraryName + ".js";
}

var config = {
    entry: [
        path.join(__dirname, "/src/main.ts")
    ],
    devtool: "source-map",
    output: {
        path: path.join(__dirname, "/dist"),
        filename: outputFile,
        library: libraryName,
        libraryTarget: "umd",
        umdNamedDefine: true
    },
    module: {
        preLoaders: [
        ],
        loaders: [
            { test: /\.tsx?$/, loader: "ts", exclude: [/node_modules/, /tests/] }
        ]
    },
    resolve: {
        root: path.resolve("./src"),
        extensions: [ '', '.js', '.ts' ]
    },
    plugins: plugins,

    // Individual Plugin Options
    tslint: {
        emitErrors: true,
        failOnHint: true
    }
};

module.exports = config;
