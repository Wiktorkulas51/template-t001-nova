import { describe, expect, it } from 'vitest';
import { SECTION_REGISTRY } from '@config/section-registry';
import appManagement from '@data/sections/app-management.json';

describe('ModernHouseSplitBlock, warianty split i neutralne dane', () => {
  it('rejestruje używany wariant appManagement', () => {
    expect(SECTION_REGISTRY.appManagement.variants.default).toMatchObject({
      component: 'ModernHouseSplitBlock',
      dataKey: 'app-management',
    });
  });

  it('ma obrazy placeholder i kompletne listy', () => {
    expect(appManagement.image).toContain('/assets/placeholders/');
    expect(appManagement.bullets).toHaveLength(3);
  });
});
