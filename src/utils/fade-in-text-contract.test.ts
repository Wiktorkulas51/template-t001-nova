import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { readdirSync } from 'node:fs';

const root = process.cwd();
const read = (file: string) => readFileSync(resolve(root, file), 'utf8');

describe('minimalny kontrakt Fade In Text', () => {
	it('nie używa jawnych data-motion-sequence w blokach (motion jest globalny)', () => {
		// Why: HeroBlock (jedyny blok z data-motion-sequence="fade") zostal
		// usuniety. Od teraz ruch obsluguje wylacznie globalny auto-reveal
		// z motion.js (data-motion-auto), a bloki hero maja wlasne animacje wejscia.
		const registry = readdirSync(resolve(root, 'src/components/registry'), { recursive: true } as any)
			.filter((file: string) => file.endsWith('.astro'))
			.map((file: string) => read(`src/components/registry/${file}`))
			.join('\n');

		expect(registry).not.toContain('data-motion-sequence');
	});

	it('używa jednorazowego observera viewportu bez scroll listenera', () => {
		const motion = read('public/js/motion.js');
		const styles = read('src/styles/motion.css');
		const heroSplit = read('src/components/registry/hero/HeroSplitBlock.astro');
		const features = read('src/components/registry/services/FeaturesBlock.astro');
		const portfolio = read('src/components/registry/portfolio/PortfolioBentoBlock.astro');
		const layout = read('src/layouts/Layout.astro');
		const section = read('src/components/ui/layout/Section.astro');

		expect(motion).toContain("document.addEventListener('astro:page-load'");
		expect(motion).toContain("document.addEventListener('astro:page-load', showTargetsImmediately)");
		expect(motion).toContain("document.addEventListener('astro:after-swap', scheduleViewportMotion)");
		expect(motion).toContain('event.newDocument');
		expect(motion).toContain("setAttribute('data-motion-ready', '')");
		expect(motion).toContain("--motion-order");
		expect(motion).toContain('IntersectionObserver');
		expect(motion).toContain('viewportObserver.observe(element)');
		expect(motion).toContain('compareDocumentPosition');
		expect(motion).toContain('function flushBatch');
		expect(motion).toContain('function isInViewport');
		expect(motion).toContain("'[data-motion-section], footer'");
		expect(motion).toContain("section.tagName === 'FOOTER'");
		expect(motion).toContain('data-motion-auto');
		expect(motion).toContain('getAutoSections');
		expect(motion).toContain('data-motion-auto-target');
		expect(motion).toContain('getAutoTargets');
		expect(motion).toContain("hasAttribute('data-motion-disabled')");
		expect(motion).not.toContain("addEventListener('scroll'");
		expect(styles).toContain('--motion-duration: 1000ms');
		expect(styles).toContain('--motion-ease: cubic-bezier(0.16, 1, 0.3, 1)');
		expect(styles).toContain('--motion-stagger: 120ms');
		expect(styles).toContain('--motion-blur: 5px');
		expect(styles).toContain('--motion-distance: 0.75rem');
		expect(styles).toContain('filter: blur(var(--motion-blur))');
		expect(styles).not.toContain('--motion-viewport');
		expect(styles).not.toContain('--motion-fade');
		expect(styles).toContain('[data-motion-auto-target]');
		expect(styles).toContain('data-motion-skip');
		expect(styles).toContain('animation: none !important');
		expect(styles).toContain('scroll-behavior: auto !important');
		// Dlaczego: HeroSplitBlock korzysta z globalnego auto-reveal sekcji,
		// dlatego nie moze miec osobnego systemu wejscia ani wlasnych timingow.
		expect(heroSplit).not.toContain('animate-hero');
		expect(heroSplit).not.toContain('@keyframes hero-enter');
		expect(features).not.toContain('data-motion-sequence');
		expect(portfolio).not.toContain('data-motion-sequence');
		expect(motion).toContain('function getMeaningfulChildren');
		expect(motion).toContain('function expandGroup');
		expect(motion).toContain('function isVisualBox');
		expect(motion).toContain('function isTextLike');
		expect(motion).toContain("child.hasAttribute('hidden')");
		expect(motion).toContain("group.classList.contains('ui-marquee')");
		expect(motion).toContain('getMeaningfulChildren(track)');
		expect(motion).toContain('marqueeTargets');
		expect(motion).toContain('hasSameTag(blocks)');
		expect(layout).toContain('data-motion-disabled');
		// Dlaczego: main nie ma transition:animate (jak u klienta Tom Ros).
		// ClientRouter podmienia DOM bez fade na main, a scroll resetuje
		// lenis.js po after-swap (behavior:instant), wiec nie ma "scroll up".
		expect(layout).not.toContain('<main transition:animate');
		expect(styles).toContain('html[data-motion-disabled] *');
		expect(styles).toContain('transition: none !important');
		expect(section).toContain('data-motion-section');
		expect(styles).toContain('prefers-reduced-motion: reduce');
	});

	it('ładuje globalny CSS i runtime w Layoucie', () => {
		const globalStyles = read('src/styles/global.css');
		const layout = read('src/layouts/Layout.astro');

		expect(globalStyles).toContain('@import "./motion.css";');
		expect(layout).toContain('src="/js/motion.js"');
		expect(layout).toContain("data-motion-ready");
	});
});
