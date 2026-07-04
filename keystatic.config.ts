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
			title: fields.slug({
				name: { label: 'Title' },
				slug: {
					label: 'Slug (controls sidebar order)',
					description:
						'Lessons sort alphabetically by slug — start it with a number to set the order: 01-intro, 02-sensors, …',
				},
			}),
			description: fields.text({
				label: 'Short description',
				description: 'Shown under the title and in search results. Optional.',
			}),
			content: fields.mdx({ label: 'Lesson content' }),
		},
	});
}

export default config({
	// GitHub mode (live): editors sign in at <site>/keystatic and their saves
	// commit straight to this repo. Requires the KEYSTATIC_* env vars — see
	// HANDOFF.md, section "CMS".
	// For offline/local content editing, temporarily swap to the local line
	// below (edits then write to your working copy — don't commit the swap).
	storage: { kind: 'github', repo: 'one-degree-north/FRC-Website' },
	// storage: { kind: 'local' },
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
				values: fields.array(
					fields.object({
						name: fields.text({ label: 'Value' }),
						detail: fields.text({ label: 'One-line detail' }),
					}),
					{
						label: 'About page: team values',
						itemLabel: (props) => props.fields.name.value,
					},
				),
				milestones: fields.array(
					fields.object({
						year: fields.text({ label: 'Year' }),
						event: fields.text({ label: 'What happened' }),
					}),
					{
						label: 'About page: milestones',
						itemLabel: (props) => props.fields.year.value,
					},
				),
				outreachPrograms: fields.array(
					fields.object({
						title: fields.text({ label: 'Program name' }),
						body: fields.text({ label: 'Description' }),
					}),
					{
						label: 'Outreach page: programs',
						itemLabel: (props) => props.fields.title.value,
					},
				),
			},
		}),
	},
});
