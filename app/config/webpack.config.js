require('../src/Global')
module.exports = () => {
  return {
    target: 'node',
    entry: ['babel-polyfill', pathResolve(appRoot, 'src/App.js')],
    output: {
      path: outputPath,
      filename: `${projectConfig.name}/app.js`,
    },
    resolve: {
      extensions: ['.js', '.json'],
      modules: [
        appRoot,
        pathResolve('src'),
        'node_modules',
      ],
      alias: {
        'src': pathResolve('src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
      ],
    },
    plugins: [],
  }
}