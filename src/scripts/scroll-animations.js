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

	// Signature moment: each latitude line draws outward from its
	// coordinate label as it scrolls into view (--line-scale drives a
	// scaleX on the line's ::before/::after rules, see Layout.astro).
	for (const line of gsap.utils.toArray('.latitude-line')) {
		gsap.from(line, {
			'--line-scale': 0,
			duration: 1.1,
			ease: 'power3.out',
			scrollTrigger: { trigger: line, ...reveal },
		});
		gsap.from(line.querySelector('span'), {
			autoAlpha: 0,
			duration: 0.5,
			delay: 0.3,
			scrollTrigger: { trigger: line, ...reveal },
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
