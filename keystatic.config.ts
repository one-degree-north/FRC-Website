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
		// Suffixed with "Lessons" so the collection list page reads clearly
		// as a list of lessons at a glance, without needing to hover an entry.
		label: `${label} Lessons`,
		slugField: 'title',
		path: `src/content/docs/lessons/${folder}/*/`,
		entryLayout: 'content',
		format: { contentField: 'content' },
		// Surfaces the description in the list table alongside the title,
		// giving each row a title + summary instead of a bare filename.
		columns: ['description'],
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
				gameLaunch: fields.object(
					{
						label: fields.text({
							label: 'Countdown label',
							description: 'Text before the date, e.g. "BIOCORE game launch".',
						}),
						date: fields.date({
							label: 'Game launch date',
							description:
								'The home page shows this date and counts down the days to it live.',
						}),
					},
					{ label: 'Home page: game-launch countdown' },
				),
				awards: fields.array(
					fields.object({
						icon: fields.text({
							label: 'Emoji',
							description: 'Shown before the award, e.g. 🏆 for a win or 🏅 for an award. Optional.',
						}),
						year: fields.text({ label: 'Year' }),
						title: fields.text({ label: 'Award' }),
					}),
					{
						label: 'Home page: awards',
						itemLabel: (props) =>
							`${props.fields.year.value} ${props.fields.title.value}`,
					},
				),
				subteams: fields.array(
					fields.object({
						name: fields.text({ label: 'Subteam' }),
						blurb: fields.text({
							label: 'What they do',
							description: 'One line, shown in the hover tooltip on the home page.',
							multiline: true,
						}),
					}),
					{
						label: 'Home page: subteams',
						itemLabel: (props) => props.fields.name.value,
					},
				),
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
		gallery: singleton({
			label: 'Photo gallery (home page)',
			path: 'src/data/gallery',
			format: { data: 'json' },
			schema: {
				photos: fields.array(
					fields.object({
						image: fields.image({
							label: 'Photo',
							// Stored under src/ so Astro optimizes it; the publicPath
							// is chosen so the saved path matches the import.meta.glob
							// key in PhotoGallery.astro.
							directory: 'src/assets/gallery',
							publicPath: '/src/assets/gallery/',
							validation: { isRequired: true },
						}),
						alt: fields.text({
							label: 'Caption',
							description:
								'Slides up over the photo on hover, and is read aloud to screen readers.',
						}),
					}),
					{
						label: 'Photos',
						itemLabel: (props) => props.fields.alt.value || 'Photo',
					},
				),
			},
		}),
	},
});
