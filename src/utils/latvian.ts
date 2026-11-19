/** Characters allowed in a Latvian recipe title (Latvian alphabet, digits, common punctuation). */
const ALLOWED = /^[A-Za-zĀČĒĢĪĶĻŅŠŪŽāčēģīķļņšūž0-9\s.,:;!?&%()'"“”„/\-–—+]+$/u;

/** Frequent English words that must not appear in a Latvian title. */
const ENGLISH_WORDS = new Set([
  'and', 'with', 'the', 'for', 'of', 'cream', 'body', 'butter', 'oil', 'scrub', 'soap', 'face', 'hair',
  'mask', 'lip', 'balm', 'recipe', 'natural', 'homemade', 'gel', 'shower', 'deodorant', 'hand', 'foot',
]);

const words = (text: string): string[] =>
  text
    .toLowerCase()
    .split(/[^\p{L}\d]+/u)
    .filter(Boolean);

/** True when the text only contains Latvian letters / digits / punctuation and no common English words. */
export function looksLatvian(text: string): boolean {
  const cleaned = text.replace(/\p{Extended_Pictographic}|️/gu, '').trim();
  return ALLOWED.test(cleaned) && !words(cleaned).some((w) => ENGLISH_WORDS.has(w));
}

/** Splits a title on "/" and returns the non-empty trimmed parts. */
export function titleParts(title: string): string[] {
  return title
    .split('/')
    .map((p) => p.trim())
    .filter(Boolean);
}
