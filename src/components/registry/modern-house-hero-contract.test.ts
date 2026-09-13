import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import heroData from '@data/sections/modern-house-hero.json';
import { SECTION_REGISTRY } from '@config/section-registry';

describe('ModernHouseHeroBlock, kontrakt rejestracji i neutralnych danych', () => {
  it('jest dostępny w mapie komponentów i registry', () => {
    const componentMapSource = readFileSync(
      resolve(process.cwd(), 'src/config/component-map.ts'),
      'utf8',
    );

    expect(componentMapSource).toContain('import.meta.glob("/src/components/registry/**/*.astro"');
    expect(componentMapSource).toContain('registryMap');
    expect(SECTION_REGISTRY.hero.variants.modernHouse).toMatchObject({
      component: 'ModernHouseHeroBlock',
      dataKey: 'modern-house-hero',
    });
  });

  it('ma dane demonstracyjne z neutralnym assetem i pełnym CTA', () => {
    expect(heroData.image).toBe('/assets/placeholders/image-landscape.svg');
    expect(heroData.primaryCta.href).toBe('/kontakt/');
    expect(heroData.secondaryCta.href).toBe('/o-nas/');
    expect(heroData.trustItems).toHaveLength(3);
  });

  it('nie zawiera hardcoded copy ani assetów klienta', () => {
    const componentSource = readFileSync(
      resolve(process.cwd(), 'src/components/registry/modern-house/ModernHouseHeroBlock.astro'),
      'utf8',
    ).toLowerCase();

    for (const forbidden of [
      'inteligentne instalacje',
      'smart home',
      'wyceń instalację',
      'zobacz realizacje',
      '/assets/images/modern-house/',
    ]) {
      expect(componentSource).not.toContain(forbidden);
    }
  });
});
