/** Test data for the shop (Veikals) page and the product page. Observed on https://bbfactory.lv/ */
import { BASE, titleOf } from './homepage.data';

export const SHOP = {
  menuName: 'Veikals',
  path: '/veikals/',
  title: titleOf('Veikals'),
  heading: 'Veikals',
};

export const PRICE_FILTER = {
  widgetHeading: 'Filtrēt pēc cenas',
  maxPrice: 10,
  /** value of the `max_price` query parameter after the filter is applied */
  urlParam: /max_price=10/,
};

export const SORTING = {
  value: 'price-desc',
  label: 'Kārtot pēc cenas: augsta līdz zema',
  urlParam: /orderby=price-desc/,
};

/** Number of products from the top of the sorted list whose price is verified */
export const PRODUCTS_TO_CHECK = 10;

export const PRODUCT_PAGE = {
  urlPattern: new RegExp(`^${BASE}/produkts/`),
  descriptionTab: 'Apraksts',
  relatedHeading: 'Saistītie Produkti',
  instagramHeading: 'Seko mums Instagram',
  addToCart: 'Pievienot grozam',
  /** Carousel buttons shown on every related product card */
  cardButtons: ['Pievienot grozam', 'Pievienot vēlmju sarakstam', 'Ātrais sakts'],
};

export const CART = {
  quantityMultiplier: '×',
};
