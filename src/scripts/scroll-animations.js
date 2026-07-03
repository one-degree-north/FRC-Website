/**
 * Scroll animations for the marketing pages (home, about, outreach).
 * The lessons section (Starlight) never loads this file.
 *
 * Everything uses gsap.from(), so the page's resting CSS is the final
 * state — with JavaScript disabled the site looks identical, just without
 * motion. Users with "reduce motion" enabled get no animation at all.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
	const reveal = { start: 'top 85%', toggleActions: 'play none none none' };

	// Hero / page header: stagger children upward on page load.
	const hero = document.querySelector('.hero, .page-head');
	if (hero) {
		gsap.from(hero.children, {
			y: 24,
			autoAlpha: 0,
			duration: 0.7,
			ease: 'power2.out',
			stagger: 0.09,
		});
	}

	// Sections below the fold rise gently into view. The record section is
	// excluded — its stats get their own staggered entrance below.
	for (const section of gsap.utils.toArray(
		'main section:not(.hero):not(.page-head):not(:has(.record))',
	)) {
		gsap.from(section, {
			y: 24,
			autoAlpha: 0,
			duration: 0.6,
			ease: 'power2.out',
			scrollTrigger: { trigger: section, ...reveal },
		});
	}

	// The team record stats count up their entrance with a small stagger.
	const record = document.querySelector('.record');
	if (record) {
		gsap.from(record.children, {
			y: 18,
			autoAlpha: 0,
			duration: 0.5,
			ease: 'power2.out',
			stagger: 0.08,
			scrollTrigger: { trigger: record, ...reveal },
		});
	}
});
