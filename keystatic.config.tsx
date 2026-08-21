import { config, collection, singleton, fields } from '@keystatic/core';
import { BrandMark } from './src/keystatic/BrandMark';

/**
 * Every subteam gets its own collection so the CMS sidebar mirrors the team
 * structure. Content is stored as plain MDX files under
 * src/content/docs/<section>/<subteam>/<slug>.mdx — where <section> is
 * `lessons` (training modules) or `documentation` (reference articles).
 * Starlight picks both subtrees up automatically, and they stay readable even
 * without Keystatic. One flat file per entry (not a folder) so each shows as a
 * single sidebar entry.
 *
 * Images inserted via the CMS are saved under
 * public/<imageDir>/<subteam>/<slug>/ and referenced by absolute URL.
 *
 * Entries appear in the site sidebar alphabetically by slug, so prefix slugs
 * with numbers to control order: 01-intro, 02-java-basics, ...
 *
 * The path glob is ** (not *), so a slug may contain a / to nest an entry in a
 * subfolder — e.g. slug "drivetrain/01-bellypan" writes
 * <subteam>/drivetrain/01-bellypan.mdx, which Starlight renders as a
 * collapsible "Drivetrain" sidebar group. A plain slug (no /) stays a flat,
 * single-line entry.
 */
function subteamCollection(options: {
	/** Subteam name shown in the CMS, e.g. "Programming". */
	label: string;
	/** Folder name under the section directory, e.g. "programming". */
	folder: string;
	/** Section directory under src/content/docs — "lessons" or "documentation". */
	section: string;
	/** Section name shown in the CMS, e.g. "Lessons" or "Documentation". */
	sectionLabel: string;
	/** Singular noun for one entry, e.g. "lesson" or "article". */
	noun: string;
	/**
	 * Folder under public/ for body images. Kept explicit (rather than derived
	 * from `section`) because the lessons pipeline already ships images under
	 * public/lesson-images/ — renaming it would break every existing embed.
	 */
	imageDir: string;
}) {
	const { label, folder, section, sectionLabel, noun, imageDir } = options;
	const Noun = noun.charAt(0).toUpperCase() + noun.slice(1);
	return collection({
		// Suffixed with the section name so the collection list page reads
		// clearly at a glance, without needing to hover an entry.
		label: `${label} ${sectionLabel}`,
		slugField: 'title',
		path: `src/content/docs/${section}/${folder}/**`,
		entryLayout: 'content',
		format: { contentField: 'content' },
		// Surfaces the description in the list table alongside the title,
		// giving each row a title + summary instead of a bare filename.
		columns: ['description'],
		schema: {
			title: fields.slug({
				name: { label: 'Title' },
				slug: {
					label: 'Slug (controls sidebar order & grouping)',
					description:
						`${Noun}s sort alphabetically by slug — start it with a number to set the order: 01-intro, 02-sensors, …. To put this ${noun} inside a sidebar group, start the slug with a group name and a slash, e.g. drivetrain/01-bellypan.`,
				},
			}),
			description: fields.text({
				label: 'Short description',
				description: 'Shown under the title and in search results. Optional.',
			}),
			content: fields.mdx({
				label: `${Noun} content`,
				options: {
					image: {
						// Uploaded images land in public/ and are referenced by an
						// absolute /<imageDir>/... URL, which Astro serves verbatim —
						// so the reference always resolves without any relative-path
						// juggling. Keystatic appends the entry slug, so each entry
						// gets its own folder:
						// public/<imageDir>/<subteam>/<slug>/<file>. The subteam
						// (folder) is baked in so same-named slugs across subteams
						// (every team has an "intro") never collide.
						directory: `public/${imageDir}/${folder}`,
						publicPath: `/${imageDir}/${folder}/`,
					},
				},
			}),
		},
	});
}

/** Training modules — /lessons/<subteam>/<slug>/ */
function lessonCollection(label: string, folder: string) {
	return subteamCollection({
		label,
		folder,
		section: 'lessons',
		sectionLabel: 'Lessons',
		noun: 'lesson',
		imageDir: 'lesson-images',
	});
}

/** Reference articles — /documentation/<subteam>/<slug>/ */
function documentationCollection(label: string, folder: string) {
	return subteamCollection({
		label,
		folder,
		section: 'documentation',
		sectionLabel: 'Documentation',
		noun: 'article',
		imageDir: 'documentation-images',
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
		brand: {
			// Zero-width space keeps Keystatic from rendering a duplicate title
			// beside our custom mark, which already includes the team name.
			name: '\u200B',
			mark: BrandMark,
		},
		// Without this, Keystatic lumps every collection under one generic
		// "Collections" heading — so the ten subteam collections read as one
		// undifferentiated list. Splitting them mirrors the two sections of the
		// site itself (/lessons/ and /documentation/).
		//
		// Note: supplying `navigation` REPLACES Keystatic's default sections
		// wholesale, so the singletons have to be listed here too or they drop
		// out of the sidebar. Every key must match a collection/singleton key
		// below — Keystatic throws "Unknown navigation key" on a typo.
		navigation: {
			Lessons: [
				'programming',
				'mechanical',
				'electrical',
				'cad',
				'business',
			],
			Documentation: [
				'programmingDocs',
				'mechanicalDocs',
				'electricalDocs',
				'cadDocs',
				'businessDocs',
			],
			Singletons: ['site', 'gallery'],
		},
	},
	collections: {
		programming: lessonCollection('Programming', 'programming'),
		mechanical: lessonCollection('Mechanical', 'mechanical'),
		electrical: lessonCollection('Electrical', 'electrical'),
		cad: lessonCollection('CAD', 'cad'),
		business: lessonCollection('Business', 'business'),
		programmingDocs: documentationCollection('Programming', 'programming'),
		mechanicalDocs: documentationCollection('Mechanical', 'mechanical'),
		electricalDocs: documentationCollection('Electrical', 'electrical'),
		cadDocs: documentationCollection('CAD', 'cad'),
		businessDocs: documentationCollection('Business', 'business'),
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
