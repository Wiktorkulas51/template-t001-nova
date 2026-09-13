import { describe, expect, it } from 'vitest';
import ctaData from '@data/sections/modern-house-cta.json';
import { SECTION_REGISTRY } from '@config/section-registry';

describe('ModernHouseCtaBlock, kontrakt rejestracji i neutralnych danych', () => {
  it('jest dostępny w rejestrze sekcji', () => {
    expect(SECTION_REGISTRY.cta.variants.default).toMatchObject({
      component: 'ModernHouseCtaBlock',
      dataKey: 'modern-house-cta',
    });
  });

  it('ma neutralny obraz i wewnętrzny link z końcowym ukośnikiem', () => {
    expect(ctaData.image).toContain('/assets/placeholders/');
    expect(ctaData.cta.href).toBe('/kontakt/');
    expect(ctaData.title).not.toContain('Smart Home');
  });
});
