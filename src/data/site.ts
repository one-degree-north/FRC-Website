/**
 * Validated access to site.json. Import `site` from here, not site.json
 * directly — if someone hand-edits the JSON and removes or empties a field
 * the pages need, the build fails with a message naming the exact problem
 * instead of a cryptic TypeError.
 */
import raw from './site.json';

function fail(field: string, problem: string): never {
	throw new Error(
		`src/data/site.json: '${field}' ${problem}. ` +
			`Restore the field (see git history) or re-save "Team info" from /keystatic.`,
	);
}

function requireText(field: string, value: unknown): string {
	if (typeof value !== 'string' || value.trim() === '') {
		fail(field, 'must be a non-empty string');
	}
	return value;
}

function requireItems<K extends string>(
	field: string,
	value: unknown,
	keys: K[],
): Record<K, string>[] {
	if (!Array.isArray(value) || value.length === 0) {
		fail(field, 'must be a non-empty list');
	}
	for (const [index, item] of value.entries()) {
		for (const key of keys) {
			if (typeof item?.[key] !== 'string' || item[key].trim() === '') {
				fail(`${field}[${index}].${key}`, 'must be a non-empty string');
			}
		}
	}
	return value;
}

export const site = {
	tagline: requireText('tagline', raw.tagline),
	homeIntro: requireText('homeIntro', raw.homeIntro),
	aboutStory: requireText('aboutStory', raw.aboutStory),
	contactEmail: requireText('contactEmail', raw.contactEmail),
	values: requireItems('values', raw.values, ['name', 'detail']),
	milestones: requireItems('milestones', raw.milestones, ['year', 'event']),
	outreachPrograms: requireItems('outreachPrograms', raw.outreachPrograms, [
		'title',
		'body',
	]),
};
