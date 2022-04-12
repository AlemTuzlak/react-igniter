export const getConfigFile = () => {
  try {
    const riConfig = require(`${process.cwd()}/react-igniter.js`);
    return riConfig;
  } catch (e) {
    throw e;
  }
};
