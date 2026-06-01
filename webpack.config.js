/*
  FILE: webpack.config.js
  PHASE: 1
  MISSION: 1-Tauri
  CHANGES:
    - R-05: Added src-tauri/ as an additional devServer static directory so
      splashscreen.html is served at http://localhost:3000/splashscreen.html
      during `tauri dev`, matching the Tauri window URL "splashscreen.html"
    - R-05: Added afterEmit plugin hook that copies src-tauri/splashscreen.html
      → wwwroot/dist/splashscreen.html on every production build so Tauri's
      frontendDist bundle contains the file it loads for the splash window
    - splitChunks.cacheGroups.vendor.chunks: 'all' (from Phase 3)
*/
const path = require('path');
const fs = require('fs');
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
            // Relative publicPath so webpack chunks resolve correctly under both
            // http:// (dev server) and tauri://localhost (Tauri production).
            publicPath: './dist/'
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        chunks: 'all'
                    }
                }
            }
        },
        devServer: {
            static: [
                // Primary static root — serves index.html and dist/ assets
                path.join(__dirname, 'wwwroot'),
                // Secondary static root — serves splashscreen.html for Tauri dev window
                { directory: path.join(__dirname, 'src-tauri'), publicPath: '/' }
            ],
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
                    target: 'http://127.0.0.1:5000',
                    changeOrigin: true,
                    secure: false,
                },
                {
                    context: ['/hubs'],
                    target: 'http://127.0.0.1:5000',
                    changeOrigin: true,
                    secure: false,
                    ws: true
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({ filename: 'main.css' }),
            ...(isDevBuild ? [] : [
                new CompressionPlugin({ test: /\.(js|css)/ })
            ]),
            // Copy splashscreen.html into the dist bundle so Tauri's frontendDist
            // can serve it for the splash window in production builds.
            {
                apply(compiler) {
                    compiler.hooks.afterEmit.tap('CopySplashscreen', () => {
                        const src = path.join(__dirname, 'src-tauri', 'splashscreen.html');
                        const dest = path.join(__dirname, 'wwwroot', 'dist', 'splashscreen.html');
                        try {
                            fs.copyFileSync(src, dest);
                        } catch (e) {
                            console.warn('[CopySplashscreen] Could not copy splashscreen.html:', e.message);
                        }
                    });
                }
            }
        ]
    };
};
