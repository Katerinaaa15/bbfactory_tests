import { BASE, INSTAGRAM, titleOf } from './homepage.data';

export const RECEIPTS = {
  menuName: 'Receptes',
  path: '/receptes/',
  title: titleOf('Receptes'),
  heading: 'Receptes',
  /** posts rendered before "Ielādēt vairāk rakstus" is used */
  initialPosts: 4,
  loadMore: 'Ielādēt vairāk rakstus',
  readMore: 'Lasīt tālāk',
  shareLabel: 'Dalīties',
};

export const SIDEBAR = {
  categoriesHeading: 'Kategorijas',
  latestHeading: 'Jaunākie raksti',
};

export const BODY_CATEGORY = {
  name: 'Ķermenim',
  path: '/raksta-kategorija/receptes/kermenim/',
  title: titleOf('Ķermenim'),
  heading: 'Ķermenim',
  readMore: 'Lasīt tālāk',
};

export const RECEIPTS_INSTAGRAM = {
  heading: INSTAGRAM.heading,
  reels: INSTAGRAM.reels,
};

export const POST_NAV = {
  older: 'Senāki',
  newer: 'Jaunāki',
};

/** Share links of a post for its absolute url. */
export const shareHrefs = (postUrl: string) => ({
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`,
  twitter: `https://x.com/share?url=${postUrl}`,
  linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${postUrl}`,
});

export const RECEIPTS_URL = `${BASE}${RECEIPTS.path}`;
