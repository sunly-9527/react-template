import { Configuration, DefinePlugin } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import * as dotenv from 'dotenv';

const path = require('path');

console.log('NODE_ENV', process.env.NODE_ENV);
console.log('BASE_ENV', process.env.BASE_ENV);

const cssRegex = /\.css$/;
const lessRegex = /\.less$/;

const styleLoadersArray = [
  'style-loader',
  {
    loader: 'css-loader',
    options: {
      modules: {
        localIdentName: '[path][name]__[local]--[hash:5]',
      },
    },
  },
   // 添加 postcss-loader
  'postcss-loader',
];

// 加载配置文件
const envConfig = dotenv.config({
  path: path.resolve(__dirname, '../env/.env.' + process.env.BASE_ENV),
});

const baseConfig: Configuration = {
  entry: path.join(__dirname, '../src/index.tsx'), // 入口文件
  // 打包出口文件
  output: {
    filename: 'static/js/[name].js', // 每个输出js的名称
    path: path.join(__dirname, '../dist'), // 打包结果输出路径
    clean: true, // webpack4需要配置 clean-webpack-plugin 来删除dist文件, webpack5 内置了
    publicPath: '/', // 打包后文件的公共前缀路径
    assetModuleFilename: 'images/[hash][ext][query]'
  },
  // loader 配置
  module: {
    rules: [
      {
        test: /.(ts|tsx)$/, // 匹配.ts, tsx文件
        use: 'babel-loader',
      },
      {
        test: /\.(png|jpeg|gif|svg|jpg|webp)$/i, // 匹配图片文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 20 * 1024, // 小于10kb转base64
          }
        },
        generator:{ 
          filename:'static/images/[hash][ext][query]', // 文件输出目录和命名
        },
      },
      {
        test: cssRegex, //匹配 css 文件
        use: styleLoadersArray,
      },
      {
        test: lessRegex,
        use: [
          ...styleLoadersArray,
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                // 可以加入modules: true，这样就不需要在less文件名加module了
                modules: true,
                // 如果要在less中写类型js的语法，需要加这一个配置
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.less', '.css'],
    // 别名需要配置两个地方，这里和 tsconfig.json
    alias: {
      '@': path.join(__dirname, '../src'),
    },
    // modules: [path.resolve(__dirname, "../node_modules")], // 查找第三方模块只在本项目的node_modules中查找
  },
  // plugins 的配置
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack5-react-ts',
      filename: 'index.html',
      // 复制 'index.html' 文件，并自动引入打包输出的所有资源（js/css）
      template: path.join(__dirname, '../public/index.html'),
      inject: true, // 自动注入静态资源
      hash: true,
      cache: false,
      // 压缩html资源
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true, //去空格
        removeComments: true, // 去注释
        minifyJS: true, // 在脚本元素和事件属性中缩小JavaScript(使用UglifyJS)
        minifyCSS: true, // 缩小CSS样式元素和样式属性
      },
      nodeModules: path.resolve(__dirname, '../node_modules'),
    }),
    new DefinePlugin({
      'process.env': JSON.stringify(envConfig.parsed),
      'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};

export default baseConfig;
