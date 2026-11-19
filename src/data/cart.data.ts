import { titleOf } from './homepage.data';

export const CART_PAGE = {
  path: '/grozs/',
  title: titleOf('Grozs'),
  viewCartButton: 'Apskatīt grozu',
  checkoutButton: 'Veikt pasūtījumu',
  sideCartHeading: 'Iepirkšanās grozs',
};

/** Section / column names of the cart page (all must be Latvian). */
export const CART_TEXTS = {
  tableColumns: ['Produkts', 'Cena', 'Daudzums', 'Summa'],
  totalsHeading: 'Groza kopsavilkums',
  totalsRows: ['Summa', 'Piegāde', 'PVN', 'Kopā'],
  couponPlaceholder: 'Kupons kods',
  couponButton: 'Izmantot kuponu',
  updateButton: 'Atjaunināt grozu',
  checkoutButton: 'Turpināt noformēt pirkumu',
  shippingLabel: 'Omniva pakomāts',
  terminalPlaceholder: 'Izvēlieties pakomāts',
  shippingFormLabels: ['Valsts / Reģions', 'Novads', 'Pilsēta', 'Pasta indekss'],
  shippingUpdateButton: 'Atjaunot',
};

export const COUPON = {
  emptyMessage: 'Lūdzu ievadiet kupona numuru.',
  invalidCode: 'kk',
  invalidMessage: 'Kuponu "kk" nevar izmantot, jo tāds neeksistē.',
};

export const CART_MESSAGES = {
  cartUpdated: 'Grozs atjaunināts.',
  shippingUpdated: 'Piegādes cena atjaunota.',
};

export const SHIPPING_ADDRESS = {
  country: 'Latvija',
  city: 'Rīga',
  postcode: '1002',
  summary: 'Piegādāt uz Rīga, LV-1002.',
  changeAddress: 'Mainīt adresi',
  required: {
    city: 'Lūdzu, aizpildiet lauku „Pilsēta”.',
    postcode: 'Lūdzu, aizpildiet lauku „Pasta indekss”.',
  },
};

/** Prices are shown with VAT; line totals and the "Summa" row are shown without VAT (bez PVN). */
export const VAT_RATE = 0.21;
export const MONEY_TOLERANCE = 0.02;
