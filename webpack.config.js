const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx'], // Add .jsx here
    fallback: {
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
    },
    alias: {
      '@admin': path.resolve(__dirname, 'admin-dashboard/src'), // Update alias to point to admin-dashboard/src
    },
  },
  entry: './src/index.jsx', // Entry point of your application
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.js', // Output file name
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Match .js and .jsx files
        exclude: /node_modules/, // Exclude node_modules
        use: {
          loader: 'babel-loader', // Use Babel for transpiling
        },
      },
    ],
  },
};
