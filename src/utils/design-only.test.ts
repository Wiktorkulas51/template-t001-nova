import { describe, expect, it } from 'vitest';
import { isDesignOnlyPath } from './design-only';

describe('isDesignOnlyPath', () => {
  it('matches the Navigator block and its internal files', () => {
    expect(isDesignOnlyPath('src/components/registry/piekary9/Piekary9NavigatorBlock.astro')).toBe(true);
    expect(isDesignOnlyPath('src/components/registry/piekary9-navigator/components/ApartmentPanel.astro')).toBe(true);
    expect(isDesignOnlyPath('D:/Programy/client-projects/starter-kit/src/components/registry/piekary9-navigator/Navigator.astro')).toBe(true);
  });

  it('does not hide regular Piekary sections', () => {
    expect(isDesignOnlyPath('src/components/registry/piekary9/Piekary9HeroBlock.astro')).toBe(false);
    expect(isDesignOnlyPath('src/data/sections/piekary9-hero.json')).toBe(false);
  });
});
