const DESIGN_ONLY_PATHS = [
  'src/components/registry/piekary9/Piekary9NavigatorBlock.astro',
  'src/components/registry/piekary9-navigator/',
  'src/data/sections/piekary9-navigator-apartments.json',
] as const;

function normalizeProjectPath(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/');
  const sourceIndex = normalized.lastIndexOf('/src/');
  if (sourceIndex >= 0) return normalized.slice(sourceIndex + 1);
  return normalized.replace(/^\.\//, '');
}

export function isDesignOnlyPath(filePath: string): boolean {
  const normalized = normalizeProjectPath(filePath);
  return DESIGN_ONLY_PATHS.some((path) => normalized === path || normalized.startsWith(path));
}
