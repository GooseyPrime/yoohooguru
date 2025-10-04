const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';
  const isFastBuild = process.env.FAST_BUILD === 'true';

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isDevelopment ? '[name].js' : '[name].[contenthash].js',
      publicPath: '/',
      clean: true,
    },
    resolve: {
      alias: {
        'react-native$': 'react-native-web',
        '@': path.resolve(__dirname, 'src'),
      },
      extensions: ['.web.js', '.js', '.jsx', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [
            'thread-loader',
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env',
                  ['@babel/preset-react', { runtime: 'automatic' }],
                ],
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8192, // 8kb - inline small images
            },
          },
          generator: {
            filename: 'assets/images/[name].[contenthash][ext]',
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/fonts/[name].[contenthash][ext]',
          },
        },
      ],
    },
    plugins: [
      // Expose only safe, public environment variables to frontend bundle.
      // Firebase config variables here are intended for client-side usage per:
      // https://firebase.google.com/docs/projects/api-keys
      // Do NOT add secrets or sensitive data to this list.
      new webpack.DefinePlugin({
        'process.env': JSON.stringify({
          NODE_ENV: process.env.NODE_ENV || 'development',
          REACT_APP_API_URL: process.env.REACT_APP_API_URL,
          REACT_APP_ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT,
          // Firebase public config - safe by design for frontend context
          REACT_APP_FIREBASE_API_KEY: process.env.REACT_APP_FIREBASE_API_KEY,
          REACT_APP_FIREBASE_AUTH_DOMAIN: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
          REACT_APP_FIREBASE_DATABASE_URL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
          REACT_APP_FIREBASE_PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID,
          REACT_APP_FIREBASE_STORAGE_BUCKET: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
          REACT_APP_FIREBASE_MESSAGING_SENDER_ID: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
          REACT_APP_FIREBASE_APP_ID: process.env.REACT_APP_FIREBASE_APP_ID,
          // App branding environment variables
          REACT_APP_BRAND_NAME: process.env.REACT_APP_BRAND_NAME,
          REACT_APP_DISPLAY_NAME: process.env.REACT_APP_DISPLAY_NAME,
          REACT_APP_LEGAL_EMAIL: process.env.REACT_APP_LEGAL_EMAIL,
          REACT_APP_PRIVACY_EMAIL: process.env.REACT_APP_PRIVACY_EMAIL,
          REACT_APP_SUPPORT_EMAIL: process.env.REACT_APP_SUPPORT_EMAIL,
          REACT_APP_CONTACT_ADDRESS: process.env.REACT_APP_CONTACT_ADDRESS,
        }),
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public',
            to: '',
            globOptions: {
              ignore: ['**/index.html'], // Exclude index.html as it's handled by HtmlWebpackPlugin
            },
          },
        ],
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        inject: true,
        ...(isDevelopment
          ? {}
          : {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              },
            }),
      }),
      ...(isDevelopment
        ? []
        : [
            new GenerateSW({
              clientsClaim: true,
              skipWaiting: true,
              runtimeCaching: [
                {
                  urlPattern: new RegExp(`^${process.env.GOOGLE_FONTS_STYLESHEETS_URL || 'https://fonts\\.googleapis\\.com'}/`),
                  handler: 'StaleWhileRevalidate',
                  options: {
                    cacheName: 'google-fonts-stylesheets',
                  },
                },
                {
                  urlPattern: new RegExp(`^${process.env.GOOGLE_FONTS_WEBFONTS_URL || 'https://fonts\\.gstatic\\.com'}/`),
                  handler: 'CacheFirst',
                  options: {
                    cacheName: 'google-fonts-webfonts',
                    expiration: {
                      maxEntries: parseInt(process.env.CACHE_MAX_ENTRIES) || 30,
                      maxAgeSeconds: parseInt(process.env.CACHE_MAX_AGE_SECONDS) || 60 * 60 * 24 * 365, // 1 year
                    },
                  },
                },
              ],
            }),
          ]),
      // Add compression plugin for production builds
      ...(isDevelopment || isFastBuild
        ? []
        : [
            new CompressionPlugin({
              algorithm: 'gzip',
              test: /\.(js|css|html|svg)$/,
              threshold: 8192,
              minRatio: 0.8,
            }),
          ]),
    ],
    devServer: {
      static: [
        {
          directory: path.join(__dirname, 'dist'),
        },
        {
          directory: path.join(__dirname, 'public'),
          publicPath: '/',
        },
      ],
      port: parseInt(process.env.FRONTEND_DEV_PORT) || 3000,
      hot: process.env.WEBPACK_DEV_HOT !== 'false',
      historyApiFallback: true,
      open: process.env.WEBPACK_DEV_OPEN !== 'false',
      headers: {
        // Configure Content Security Policy for Google Sign-in and Firebase in development
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://js.stripe.com https://www.google.com https://gstatic.com https://accounts.google.com https://www.googletagmanager.com https://www.google-analytics.com",
          "script-src-elem 'self' 'unsafe-inline' https://apis.google.com https://js.stripe.com https://www.google.com https://gstatic.com https://accounts.google.com https://www.googletagmanager.com https://www.google-analytics.com",
          "frame-src 'self' https://accounts.google.com https://*.firebaseapp.com https://js.stripe.com https://www.google.com",
          "connect-src 'self' ws://localhost:* https://accounts.google.com https://www.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://oauth2.googleapis.com https://api.stripe.com https://www.google-analytics.com https://analytics.google.com",
          "img-src 'self' data: https: blob:",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com"
        ].join('; '),
        // Additional security headers (relaxed for development)
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': '1; mode=block',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      },
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 250000,
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
            maxSize: 250000,
          },
          firebase: {
            test: /[\\/]node_modules[\\/](@firebase|firebase)[\\/]/,
            name: 'firebase',
            priority: 10,
            chunks: 'all',
            maxSize: 200000,
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react-vendor',
            priority: 20,
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
            chunks: 'all',
          },
        },
      },
      // Optimize build performance
      minimize: !isDevelopment && !isFastBuild,
      ...(isDevelopment || isFastBuild
        ? {}
        : {
            usedExports: true,
            sideEffects: false,
            moduleIds: 'deterministic',
            runtimeChunk: {
              name: 'runtime',
            },
          }),
    },
    // Add caching for better build performance
    cache: {
      type: 'filesystem',
      cacheDirectory: path.resolve(__dirname, '.webpack-cache'),
      buildDependencies: {
        config: [__filename],
      },
    },
    // Improve performance in production builds
    ...(isDevelopment || isFastBuild
      ? {}
      : {
          performance: {
            maxAssetSize: 1500000, // 1.5MB - accommodate current bundle size with Firebase modules
            maxEntrypointSize: 1500000, // 1.5MB - accommodate current entry bundle size  
            hints: 'warning',
            assetFilter: function(assetFilename) {
              // Don't show warnings for large images or fonts
              return !(/\.(png|jpe?g|gif|svg|woff|woff2|eot|ttf|otf)$/i.test(assetFilename));
            },
          },
        }),
  };
};