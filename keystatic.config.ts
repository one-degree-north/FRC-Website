import { config, collection, singleton, fields } from '@keystatic/core';

/**
 * Every subteam gets its own collection so the CMS sidebar mirrors the team
 * structure. Lessons are stored as plain MDX files in
 * src/content/docs/lessons/<subteam>/<lesson-slug>/index.mdx — Starlight
 * picks them up automatically, and they stay readable even without Keystatic.
 *
 * Lessons appear in the site sidebar alphabetically by slug, so prefix slugs
 * with numbers to control order: 01-intro, 02-java-basics, ...
 */
function lessonCollection(label: string, folder: string) {
	return collection({
		label,
		slugField: 'title',
		path: `src/content/docs/lessons/${folder}/*/`,
		entryLayout: 'content',
		format: { contentField: 'content' },
		schema: {
			title: fields.slug({ name: { label: 'Title' } }),
			description: fields.text({
				label: 'Short description',
				description: 'Shown under the title and in search results. Optional.',
			}),
			content: fields.mdx({ label: 'Lesson content' }),
		},
	});
}

export default config({
	// Local mode: edits write directly to files on your computer.
	// After deploying, switch to GitHub mode so editors can work in the
	// browser without installing anything — see HANDOFF.md, section "CMS".
	storage: { kind: 'local' },
	// storage: { kind: 'github', repo: 'YOUR_GITHUB_ORG/YOUR_REPO' },
	ui: {
		brand: { name: 'One Degree North' },
	},
	collections: {
		programming: lessonCollection('Programming', 'programming'),
		mechanical: lessonCollection('Mechanical', 'mechanical'),
		electrical: lessonCollection('Electrical', 'electrical'),
		cad: lessonCollection('CAD', 'cad'),
		business: lessonCollection('Business', 'business'),
	},
	singletons: {
		site: singleton({
			label: 'Team info (marketing pages)',
			path: 'src/data/site',
			format: { data: 'json' },
			schema: {
				tagline: fields.text({ label: 'Home page tagline' }),
				homeIntro: fields.text({
					label: 'Home page intro paragraph',
					multiline: true,
				}),
				aboutStory: fields.text({
					label: 'About page: team story',
					description: 'Separate paragraphs with a blank line.',
					multiline: true,
				}),
				contactEmail: fields.text({ label: 'Contact email' }),
			},
		}),
	},
});
