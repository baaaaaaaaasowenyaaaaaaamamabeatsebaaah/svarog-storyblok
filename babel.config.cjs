module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['> 0.5%', 'last 2 versions', 'not dead'],
        },
        modules: false,
      },
    ],
  ],
  plugins: [],
};
