import { titleOf } from './homepage.data';

export const MY_ACCOUNT = {
  path: '/mans-konts/',
  title: titleOf('Mans konts'),
  heading: 'Mans konts',
  menu: ['Rīku panelis', 'Pasūtījumi', 'Adrese', 'Profila informācija', 'Vēlmju saraksts', 'Iziet'],
};

export const ORDERS = {
  menu: 'Pasūtījumi',
  path: '/mans-konts/pasutijumi/',
  verifyButton: 'Apstiprināt e-pasta adresi',
  verifyText: 'Apstipriniet savu e-pasta adresi, lai atrastu iepriekšējos pasūtījumus un pievienotu tos savam kontam.',
  columns: ['Pasūtījums', 'Datums', 'Statuss', 'Kopā', 'Darbības'],
  viewButton: 'Skatīt',
  invoiceButton: 'Pavadzīme',
  invoiceFile: /^pavadzimes-\d+\.pdf$/,
};

export const ORDER_VIEW = {
  path: /\/mans-konts\/skatit-pasutijumu\/\d+\/?$/,
  intro: /^Pasūtījums #\d+ tika izveidots .+ un pašlaik ir .+\.$/,
  headings: [
    'Pasūtījuma informācija',
    'Produkts',
    'Kopā',
    'Summa:',
    'Piegāde:',
    'PVN:',
    'Maksājuma veids:',
    'Kopā:',
    'Darbības:',
    'Papildus detaļas',
    'Norēķinu adrese',
    'Piegādes adrese',
  ],
};

export const ADDRESSES = {
  menu: 'Adrese',
  path: '/mans-konts/rediget-adresi/',
  intro: 'Šīs adreses tiks izmantotas preču pasūtīšanas lapā. Jūs tās varēsiet mainīt.',
  headings: ['Norēķinu adrese', 'Piegādes adrese'],
  editBilling: 'Labot Norēķinu adrese',
  editShipping: 'Labot Piegādes adrese',
  billingPath: '/mans-konts/rediget-adresi/maksasana/',
  billingHeading: 'Norēķinu adrese',
  saveButton: 'Saglabāt adresi',
  /** field id -> label text (without the "*" / "(nav obligāts)" marks) */
  billingLabels: {
    billing_first_name: 'Vārds',
    billing_last_name: 'Uzvārds',
    billing_company: 'Uzņēmuma nosaukums',
    billing_country: 'Valsts / Reģions',
    billing_address_1: 'Ielas nosaukums',
    billing_address_2: 'Dzīvokļa nr., korpuss, mājas nosaukums u.tml.',
    billing_city: 'Pilsēta',
    billing_state: 'Novads',
    billing_postcode: 'Pasta indekss',
    billing_phone: 'Tālrunis',
    billing_email: 'Epasta adrese',
  } as Record<string, string>,
  placeholders: {
    billing_address_1: 'Mājas numurs un ielas nosaukums',
    billing_address_2: 'Dzīvoklis, mājas nosaukums u.c. (nav obligāts)',
  } as Record<string, string>,
};

export const PROFILE = {
  menu: 'Profila informācija',
  path: '/mans-konts/rediget-kontu/',
  labels: {
    account_first_name: 'Vārds',
    account_last_name: 'Uzvārds',
    account_display_name: 'Lietotājvārds',
    account_email: 'Epasta adrese',
    password_current: 'Pašreizējā parole (atstājiet tukšu, ja nevēlaties to mainīt)',
    password_1: 'Jaunā parole (atstājiet tukšu, ja nevēlaties to mainīt)',
    password_2: 'Apstipriniet jauno paroli',
  } as Record<string, string>,
  displayNameHint: 'Tādā veidā jūsu vārds tiks parādīts konta sadaļā',
  passwordSection: 'Paroles maiņa',
  saveButton: 'Saglabāt izmaiņas',
  /** Random values: they never match each other, so nothing is saved. */
  randomCurrentPassword: 'Current789!c',
  randomNewPassword: 'Random123!a',
  randomConfirmPassword: 'Different456!b',
  mismatchMessage: 'Jaunās paroles nesakrīt.',
};
