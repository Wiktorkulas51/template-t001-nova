import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import bentoData from '@data/sections/modern-house-services-bento.json';
import { SECTION_REGISTRY } from '@config/section-registry';

describe('ModernHouseServicesBentoBlock, kontrakt danych i rejestracji', () => {
  it('jest zarejestrowany jako wariant features', () => {
    expect(SECTION_REGISTRY.features.variants.modernHouseBento).toMatchObject({
      component: 'ModernHouseServicesBentoBlock',
      dataKey: 'modern-house-services-bento',
    });
  });

  it('używa neutralnych danych i kompletnego bento', () => {
    expect(bentoData.items).toHaveLength(5);
    expect(bentoData.items.filter((item) => item.image)).toHaveLength(2);
    expect(bentoData.moreHref).toMatch(/^\/.+\/$/);
    expect(bentoData.items.every((item) => item.title && item.description)).toBe(true);
  });

  it('nie zawiera treści ani assetów Modern House', () => {
    const source = readFileSync(
      resolve(process.cwd(), 'src/components/registry/modern-house/ModernHouseServicesBentoBlock.astro'),
      'utf8',
    ).toLowerCase();

    for (const forbidden of ['smart home', 'instalacje elektryczne', '/assets/images/modern-house/']) {
      expect(source).not.toContain(forbidden);
    }
  });
});
