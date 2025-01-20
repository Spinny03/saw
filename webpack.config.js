module.exports = {
  // ...existing code...
  module: {
    rules: [
      // ...existing rules...
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true,
            },
          },
        ],
      },
    ],
  },
  // ...existing code...
};
