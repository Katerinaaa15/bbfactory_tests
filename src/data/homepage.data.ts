/** Test data for the home page. All values were observed on https://bbfactory.lv/ */

export const SITE_NAME = 'BB Factory';
export const BASE = 'https://bbfactory.lv';

/** Page title helper: every page on the site is titled "<name> | BB Factory". */
export const titleOf = (name: string): string => `${name} | ${SITE_NAME}`;

export const HOME_TITLE = titleOf('Sākumlapa');

export const HEADER = {
  phoneText: '+371 29 419 087',
  phoneHref: 'tel:+371 29 419 087',
  topBarTexts: ['Kosmētikas izejvielu interneta veikals', 'Bezmaksas piegāde no 40 €'],
  iconLinks: [
    { name: 'account', path: '/mans-konts/' },
    { name: 'wishlist', path: '/velmju-saraksts/' },
    { name: 'cart', path: '/grozs/' },
  ],
};

export interface PageLink {
  name: string;
  path: string;
  title: string;
}

/** Top main menu */
export const MAIN_MENU: PageLink[] = [
  { name: 'Sākumlapa', path: '/', title: HOME_TITLE },
  { name: 'Veikals', path: '/veikals/', title: titleOf('Veikals') },
  { name: 'Receptes', path: '/receptes/', title: titleOf('Receptes') },
  { name: 'Par mums', path: '/par-mums/', title: titleOf('Par mums') },
  { name: 'Kontakti', path: '/kontakti/', title: titleOf('Kontakti') },
];

export const HERO = {
  subtitle: 'Pie mums atradīsi',
  heading: 'Kvalitatīvu kosmētiku un izejvielas.',
  description: 'BBFactory piedāvā gatavu dabisko kosmētiku un izejvielas.',
  button: { name: 'Uz veikalu', ...{ path: '/veikals/', title: titleOf('Veikals') } },
};

export const OILS_SECTION = {
  headings: ['Dabiskās', 'eļļas'],
  viewAll: { name: 'Apskatīt visas', path: '/kategorija/ellas/', title: titleOf('Eļļas') },
  products: ['Iedeguma eļļa', 'Vīnogu kauliņu eļļa', 'Aprikožu kauliņu eļļa', 'Arnikas eļļa – 50 ml'],
};

export const BASES_SECTION = {
  headings: ['Kosmētikas', 'bāzes'],
  viewAll: {
    name: 'Apskatīt visas',
    path: '/kategorija/kosmetikas-laboratorija/',
    title: titleOf('Kosmētikas laboratorija'),
  },
  products: ['A-C-E vitamīnu komplekss 5ml', 'Acu “anti-age” kapsulas 7 gb', 'Akācijas sveķi 10 gr.'],
};

export interface CategoryBanner {
  label: string;
  path: string;
  title: string;
}

/** Category promo banners (5 tiles in the middle of the page) */
export const CATEGORY_BANNERS: CategoryBanner[] = [
  { label: 'Eļļas', path: '/kategorija/ellas/', title: titleOf('Eļļas') },
  { label: 'Ēteriskās eļļas', path: '/kategorija/eteriskas-ellas/', title: titleOf('Ēteriskās eļļas') },
  {
    label: 'Kosmētikas bāzes',
    path: '/kategorija/kosmetikas-laboratorija/',
    title: titleOf('Kosmētikas laboratorija'),
  },
  { label: 'Gatavā kosmētika', path: '/kategorija/gatava-kosmetika/', title: titleOf('Gatavā kosmētika') },
  {
    label: 'Kosmētikas iepakojums',
    path: '/kategorija/kosmetikas-iepakojums/',
    title: titleOf('Kosmētikas iepakojums'),
  },
];

export const PROMO_SECTION = {
  heading: 'Atklāj dabiskās kosmētikas spēku.',
  features: [/^Kvalitātīvs\s+produkts$/, /^Dabīgas\s+izejvielas$/, /^Pierādīta\s+efektivitāte$/],
  button: { name: 'Doties uz veikalu', path: '/veikals/', title: titleOf('Veikals') },
};

/** Products shown on the home page (sections "Dabiskās eļļas" and "Kosmētikas bāzes") */
export const SOLD_OUT_LABEL = 'Izpārdots';
export const SOLD_OUT_PRODUCTS = ['Iedeguma eļļa', 'Acu “anti-age” kapsulas 7 gb'];

export interface Recipe {
  title: string;
  slug: string;
}

export const RECIPES_HEADING = 'Receptes';
export const RECIPES: Recipe[] = [
  { title: 'Krēms sejai/ 4 sastāvdaļas', slug: 'krems-sejai-4-sastavdalas' },
  { title: 'Šampūnziepes sausiem matiem', slug: 'sampunziepes-sausiem-matiem' },
  { title: 'Zelta balzāms matiem', slug: 'zelta-balzams-matiem' },
  { title: 'Mitrinošs-atjaunojošs acu krēms (30 ml)', slug: 'mitrinoss-atjaunojoss-acu-krems-30-ml' },
  { title: 'Krēmveida ziepes', slug: 'kremveida-ziepes' },
  { title: 'Dušas zefīrs', slug: 'dusas-zefirs' },
  { title: 'Aveņu lūpu spīdums', slug: 'avenu-lupu-spidums' },
  { title: 'Fenheļa-zaļa mandarīna sāls skrubis', slug: 'fenhela-zala-mandarina-sals-skrubis' },
  { title: 'Rožu sāls skrubis (65ml)', slug: 'rozu-sals-skrubis-65ml' },
];

/** Share link templates for a recipe URL */
export const shareLinks = (postUrl: string) => ({
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`,
  x: `https://x.com/share?url=${postUrl}`,
  linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${postUrl}`,
});

export const REVIEWS = {
  subtitle: 'Atsauksmes',
  heading: /^Ko mūsu\s+klienti\s+saka$/,
  items: [
    { author: 'Sandra', text: 'Šis ir kosmētikas izejvielu veikaliņš' },
    { author: 'Laura', text: 'Labi produkti un patīkama apkalpošana' },
    { author: 'Malvīne', text: 'Lieliska vieta ar lieliskiem profesionāļiem' },
    { author: 'Aleksandra', text: 'Liels sastāvdaļu klāsts mājās gatavotai kosmētikai' },
    { author: 'Anta', text: 'Vienmēr viss atrodams' },
    { author: 'Anna', text: 'Jauka apkalpošana, kvalitatīvi produkti' },
    { author: 'Marta', text: 'Sapirkos visādus labumus no BBFactory' },
  ],
};

export const INSTAGRAM = {
  heading: 'Seko mums Instagram',
  /** Reel ids of the posts shown in the feed */
  reels: ['DTAY-WmDGRR', 'DEF9AxJReou', 'DEDWtpWC3FI', 'DD8Av9_i-bT', 'C8APkm_i7mq', 'C4JC0Api36K'],
};

export const FOOTER = {
  logoHref: 'https://bbfactory.lv',
  address: 'Kr.Barona iela 40, Jelgava, Latvija',
  phoneText: '+371 29419087',
  phoneHref: 'tel:+371%2029419087',
  email: 'ieva@bbfactory.lv',
  emailHref: 'mailto:ieva@bbfactory.lv',
  facebookHref: 'https://www.facebook.com/bbfactorycosmetics/',
  instagramHref: 'https://www.instagram.com/bbfactorylv/',
  workingHours: 'Interneta veikals strādā: 24/7',
  developer: { name: 'WD Market', href: 'https://wdmarket.com/' },
  navigation: MAIN_MENU,
  categories: [
    { name: 'Gatavā kosmētika', path: '/kategorija/gatava-kosmetika/', title: titleOf('Gatavā kosmētika') },
    { name: 'Sezonas piedāvājums', path: '/kategorija/sezonas-piedavajums/', title: titleOf('Sezonas piedāvājums') },
    { name: 'Jaunākie produkti', path: '/kategorija/jaunakie-produkti/', title: titleOf('Jaunākie produkti') },
    { name: 'Akcijas produkti', path: '/kategorija/akcijas-produkti/', title: titleOf('Akcijas produkti') },
    { name: 'Eļļas', path: '/kategorija/ellas/', title: titleOf('Eļļas') },
    { name: 'Sviesti', path: '/kategorija/sviesti/', title: titleOf('Sviesti') },
    { name: 'Ziedūdeņi', path: '/kategorija/ziedudeni/', title: titleOf('Ziedūdeņi') },
    { name: 'Ziepes', path: '/kategorija/ziepes/', title: titleOf('Ziepes') },
    { name: 'Matu mazgāšanai', path: '/kategorija/matu-mazgasanai/', title: titleOf('Matu mazgāšanai') },
    { name: 'Dabīgi aromāti', path: '/kategorija/dabigi-aromati/', title: titleOf('Dabīgi aromāti') },
    { name: 'Ēteriskās eļļas', path: '/kategorija/eteriskas-ellas/', title: titleOf('Ēteriskās eļļas') },
    {
      name: 'Kosmētikas laboratorija',
      path: '/kategorija/kosmetikas-laboratorija/',
      title: titleOf('Kosmētikas laboratorija'),
    },
    { name: 'Māli un sāls', path: '/kategorija/mali-un-sals/', title: titleOf('Māli un sāls') },
    {
      name: 'Piena un augļu pulveri',
      path: '/kategorija/piena-un-auglu-pulveri/',
      title: titleOf('Piena un augļu pulveri'),
    },
    {
      name: 'Kosmētikas iepakojums',
      path: '/kategorija/kosmetikas-iepakojums/',
      title: titleOf('Kosmētikas iepakojums'),
    },
    { name: 'Dāvanu kartes', path: '/kategorija/davanu-kartes/', title: titleOf('Dāvanu kartes') },
  ] as PageLink[],
  usefulLinks: [
    { name: 'Noteikumi', path: '/lietosanas-noteikumi/', title: titleOf('Lietošanas noteikumi') },
    { name: 'Privātuma politika', path: '/privatuma-politika/', title: titleOf('Privātuma politika') },
  ] as PageLink[],
};
