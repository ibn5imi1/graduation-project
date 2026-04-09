const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const path = require("path");

module.exports = {
    mode: "development",

    entry: {
        app: "./src/index.js"
    },

    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "dist")
        },
        hot: false,
        port: 2001,
        open: true,
        devMiddleware: {
            writeToDisk: true
        }
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: {
                            minimize: true,
                        }
                    }
                ]
            },
            {
                test: /\.(sa|sc|c)ss$/, 
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: false
                        }
                    },
                    {
                        loader: "css-loader",
                        options: { importLoaders: 1 }
                    },
                    {
                        loader: "sass-loader", // هذا هو المترجم المفقود الذي يحول SASS إلى CSS
                    }
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/i,
                type: "asset/resource",
                generator: {
                    filename: "./images/[name][ext]"
                }
            }
        ],
    },
    plugins: [new HtmlWebpackPlugin({
        filename: "index.html",
        template: "./src/index.html"
    }),
    new HtmlWebpackPlugin({
        filename: "about.html",
        template: "./src/about.html"
    }),
    new HtmlWebpackPlugin({
        filename: "contactUs.html",
        template: "./src/contactUs.html"
    }),
    new HtmlWebpackPlugin({
        filename: "pizza.html",
        template: "./src/pizza.html"
    }),
    new HtmlWebpackPlugin({
        filename: "product1.html",
        template: "./src/product1.html"
    }),
    new HtmlWebpackPlugin({
        filename: "product2.html",
        template: "./src/product2.html"
    }),
    new HtmlWebpackPlugin({
        filename: "product3.html",
        template: "./src/product3.html"
    }),
    new MiniCssExtractPlugin({
        filename: "css/style.css"
    }),
    new CssMinimizerPlugin()
    ],
};