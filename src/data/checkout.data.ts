import { titleOf } from './homepage.data';

export const CHECKOUT = {
  path: '/pasutijums/',
  title: titleOf('Pasūtījums'),
  cartContinueButton: 'Turpināt noformēt pirkumu',
};

export const LOGIN = {
  toggle: 'Klikšķiniet te, lai autorizētos',
  question: 'Esat atgriezies veikalā?',
  labels: ['Lietotājvārds vai e-pasta adrese', 'Parole'],
  submit: 'Pieslēgties',
};

export const COUPON_FORM = {
  toggle: 'Spied šeit, lai ievadītu kupona kodu',
  question: 'Pieejams kupons?',
  placeholder: 'Kupons kods',
  button: 'Izmantot kuponu',
  emptyMessage: 'Lūdzu ievadiet kupona numuru.',
  invalidCode: 'kk',
  invalidMessage: 'Kuponu "kk" nevar izmantot, jo tāds neeksistē.',
};

/** Headings (section and shipment titles) of the checkout page, all in Latvian. */
export const HEADINGS = {
  billing: 'Norēķinu informācija',
  additional: 'Papildu informācija',
  order: 'Jūsu pasūtījums',
  terms: 'Lietošanas noteikumi',
};

/** Labels of the visible input fields. The text is matched without the "*" / "(nav obligāts)" marks. */
export const FIELD_LABELS = {
  person: 'Persona',
  individual: 'Fiziska persona',
  legalEntity: 'Juridiska persona',
  firstName: 'Vārds',
  lastName: 'Uzvārds',
  country: 'Valsts / Reģions',
  street: 'Ielas nosaukums',
  city: 'Pilsēta',
  state: 'Novads',
  postcode: 'Pasta indekss',
  phone: 'Tālrunis',
  email: 'Epasta adrese',
  notes: 'Pasūtījuma piezīmes',
  createAccount: 'Izveidot kontu?',
  shipToDifferent: 'Piegādāt citā adresē?',
  terms: 'Esmu izlasījis un piekrītu saita Lietošanas noteikumiem.',
};

export const PLACEHOLDERS = {
  street: 'Mājas numurs un ielas nosaukums',
  street2: 'Dzīvoklis, mājas nosaukums u.c. (nav obligāts)',
  notes: 'Pasūtījuma piezīmes, papildu norādījumi par piegādi.',
};

export const ORDER_TABLE = {
  columns: ['Produkts', 'Summa'],
  rows: ['Summa', 'Piegāde', 'PVN', 'Kopā'],
  shippingLabel: 'Omniva pakomāts',
};

export const PAYMENT = {
  methods: ['Tiešais bankas pārskaitījums', 'Kredītkartes', 'Internetabanka', 'PayPal'],
  bank: 'Internetabanka',
  placeOrder: 'Veikt pasūtījumu',
};

/** Validation shown after "Veikt pasūtījumu" with all fields empty. */
export const REQUIRED_ERRORS = {
  list: [
    'Lūdzu, izvēlieties pakomāts.',
    'Norēķinu Vārds ir obligātais lauks.',
    'Norēķinu Uzvārds ir obligātais lauks.',
    'Norēķinu Ielas nosaukums ir obligātais lauks.',
    'Norēķinu Pilsēta ir obligātais lauks.',
    'Norēķinu Pasta indekss ir obligātais lauks.',
    'Norēķinu Tālrunis ir obligātais lauks.',
    'Norēķinu Epasta adrese ir obligātais lauks.',
    'Lai turpinātu pasūtījumu, lūdzu izlasiet un pieņemiet noteikumus un nosacījumus.',
  ],
  inline: {
    billing_first_name_field: 'Norēķinu Vārds ir obligātais lauks.',
    billing_last_name_field: 'Norēķinu Uzvārds ir obligātais lauks.',
    billing_address_1_field: 'Norēķinu Ielas nosaukums ir obligātais lauks.',
    billing_city_field: 'Norēķinu Pilsēta ir obligātais lauks.',
    billing_postcode_field: 'Norēķinu Pasta indekss ir obligātais lauks.',
    billing_phone_field: 'Norēķinu Tālrunis ir obligātais lauks.',
    billing_email_field: 'Norēķinu Epasta adrese ir obligātais lauks.',
  } as Record<string, string>,
};

/** Test customer. The first name marks the data as a test, so it is ignored by the shop. */
export const CUSTOMER = {
  firstName: 'test wdmarket ignore',
  lastName: 'test',
  country: 'Latvija',
  street: 'Grīna bulvāris 15-29',
  city: 'Rīga',
  state: 'Rīga',
  postcode: '1002',
  phone: '23456788',
  email: 'example@test.lv',
  notes: 'test',
};

export const NO_PAYMENT_METHOD_MESSAGE = 'Nav izvēlēta maksājuma metode!';
