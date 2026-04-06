const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = (env) => {

    const isDevBuild = !(env && env.prod);

    return {
        mode: isDevBuild ? 'development' : 'production',
        devtool: isDevBuild ? 'source-map' : false,
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx']
        },
        module: {
            rules: [
                {
                    test: /\.ts(x?)$/,
                    include: /ReactApp/,
                    exclude: [/node_modules/, /obj/],
                    use: [{ loader: 'ts-loader' }]
                },
                {
                    test: /\.scss$/,
                    exclude: /node_modules/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.css$/,
                    exclude: /node_modules/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader'
                    ]
                },
                {
                    test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                    type: 'asset/resource'
                }
            ]
        },
        entry: {
            main: './ReactApp/index.tsx'
        },
        output: {
            path: path.join(__dirname, 'wwwroot', 'dist'),
            filename: '[name].js',
            publicPath: '/dist/'
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        chunks: 'initial'
                    }
                }
            }
        },
        devServer: {
            static: path.join(__dirname, 'wwwroot'),
            port: 3000,
            historyApiFallback: true,
            headers: {
                "Content-Security-Policy": [
                    "default-src 'self' http://localhost:3000 ws://localhost:3000 http://127.0.0.1:* ws://127.0.0.1:*",
                    "script-src 'self' 'unsafe-inline' http://localhost:3000",
                    "style-src 'self' 'unsafe-inline' http://localhost:3000 https://fonts.googleapis.com",
                    "style-src-elem 'self' 'unsafe-inline' http://localhost:3000 https://fonts.googleapis.com",
                    "connect-src 'self' http://localhost:3000 http://127.0.0.1:* http://localhost:* ws://localhost:3000 ws://localhost:* ws://127.0.0.1:*",
                    "img-src 'self' data: blob:",
                    "font-src 'self' data: https://fonts.gstatic.com"
                ].join('; ')
            },
            proxy: [
                {
                    context: ['/api'],
                    target: 'http://localhost:5000',
                    changeOrigin: true,
                    secure: false,
                },
                {
                    context: ['/hubs'],
                    target: 'http://localhost:5000',
                    changeOrigin: true,
                    secure: false,
                    ws: true // WebSocket support for SignalR
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({ filename: 'main.css' }),
            ...(isDevBuild ? [] : [
                new CompressionPlugin({ test: /\.(js|css)/ })
            ])
        ]
    };
};
