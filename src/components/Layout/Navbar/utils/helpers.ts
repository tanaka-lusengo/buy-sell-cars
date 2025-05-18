export const stripTrailingSlash = (path: string) =>
  path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
