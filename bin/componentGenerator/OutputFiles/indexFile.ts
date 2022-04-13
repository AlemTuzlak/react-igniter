export const indexFile = (name: string, exportType: string = "named") => {
  return [
    ...(exportType === "named"
      ? [`export { ${name} } from './${name}';`]
      : [`import ${name} from './${name}';`]),
    ...(exportType === "named" ? [] : [`export { ${name} };`]),
  ].join("\n");
};
