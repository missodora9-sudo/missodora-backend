module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
    ],
    // AJOUTEZ CES LIGNES pour désactiver le compilateur React
    env: {
      development: {
        plugins: [],
      },
      production: {
        plugins: [],
      },
    },
  };
};