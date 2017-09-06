module.exports = {
  extends: 'airbnb',
  plugins: ['react', 'jsx-a11y', 'import'],
  globals: {
    localStorage: 1,
    document: 1,
  },
  rules: {
    'react/jsx-filename-extension': 0,
  },
};
