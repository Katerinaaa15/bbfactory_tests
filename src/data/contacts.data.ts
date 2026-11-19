import { INSTAGRAM, titleOf } from './homepage.data';

export const CONTACTS = {
  menuName: 'Kontakti',
  path: '/kontakti/',
  title: titleOf('Kontakti'),
};

export const MAP = {
  /** the embedded Google map is centred on this address */
  address: 'Kr. Barona iela 40, Jelgava, Latvija',
};

export const OUR_SHOP = {
  subtitle: 'Mūsu veikals',
  heading: 'Iepērcies tiešsaistē www.bbfactory.lv',
  addressLine: 'Biroja adrese: Kr. Barona iela 40, Jelgava, Latvija',
  phoneText: '+371 29 419 087',
  phoneHref: 'tel:+371 29 419 087',
  email: 'ieva@bbfactory.lv',
  emailHref: 'mailto:ieva@bbfactory.lv',
  readMore: 'Lasīt vairāk',
  readMoreHref: '/par-mums',
  aboutPath: '/par-mums/',
  aboutTitle: titleOf('Par mums'),
};

export const FAQ = {
  heading: 'BIEŽI UZDOTIE JAUTĀJUMI',
  questions: [
    'Cik ilgā laikā pēc pasūtīšanas saņemšu savu pasūtījumu?',
    'Vai klātienes veikalā var iegādāties tos pašus produktus ko interneta veikalā?',
    'Vai iespējams iegādāties produktus lielākā tilpumā, nekā standarta iepakojumi?',
    'Vai obligāti nepieciešams veikt pasūtījumu, lai preces saņemtu klātienes veikalā?',
  ],
};

export const CONTACT_FORM = {
  heading: 'SAZINIETIES AR MUMS',
  submit: 'Sūtīt',
  requiredLegend: 'norāda obligātos laukus',
  /** field id -> label (the required ones carry "*") */
  labels: {
    field_1_1: 'Vārds',
    field_1_2: 'Uzvārds',
    field_1_3: 'E-pasts',
    field_1_6: 'Temats',
    field_1_5: 'Jūsu ziņa',
  } as Record<string, string>,
  mandatory: ['field_1_3', 'field_1_6', 'field_1_5'],
  optional: ['field_1_1', 'field_1_2'],
  requiredMessage: 'Šis lauks ir obligāts.',
  summaryMessage: 'Radusies problēma ar jūsu iesniegumu. Lūdzu apskatiet zemāk esošos laukus.',
};

export const CONTACTS_INSTAGRAM = {
  heading: INSTAGRAM.heading,
  reels: INSTAGRAM.reels,
};
