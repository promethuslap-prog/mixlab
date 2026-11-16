// GitHub Pages publishes this repo at /mixlab/. That base path is only applied
// when MIXLAB_WEB_BASE is set (the Pages workflow). Expo Go keeps the default.
module.exports = ({ config }) => {
  const baseUrl = process.env.MIXLAB_WEB_BASE;
  if (!baseUrl) return config;
  return {
    ...config,
    experiments: {
      ...config.experiments,
      baseUrl,
    },
  };
};
