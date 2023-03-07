const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

module.exports = {
    mode: nodeEnv,
    entry: {
        main: "./src/index.js",
        redirect: './src/redirect.js',
    },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: '[name].bundle.js',
        chunkFilename: '[id].bundle_[chunkhash].js',
        sourceMapFilename: '[file].map',
    },
    module: {
        // exclude node_modules
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
        ],
    },
    resolve: {
        extensions: ["*", ".js", ".jsx"],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.join(__dirname, "public", "index.html"),
            chunks: ['main'],
        }),
        new HtmlWebpackPlugin({
            filename: 'redirect.html',
            template: path.join(__dirname, "public", "redirect.html"),
            chunks: ['redirect'],
        }),
    ],
    devtool: isProd ? 'source-map' : 'cheap-source-map',
};
