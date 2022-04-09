export const checkPackageDependency = (packageJson: Record<string,any>, dependency: string) => { 
  return (packageJson?.dependencies && packageJson.dependencies[dependency])??false;
}
