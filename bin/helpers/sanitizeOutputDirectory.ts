export const sanitizeOutputDirectory = (
  outputDir: string,
  fallbackDir: string
) => {
  return new RegExp(/^.*\.[^\\]+$/).test(outputDir) ? fallbackDir : outputDir;
};
