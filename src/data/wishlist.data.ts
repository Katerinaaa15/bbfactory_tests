import { titleOf } from './homepage.data';

export const WISHLIST = {
  path: '/velmju-saraksts/',
  title: titleOf('Vēlmju saraksts'),
  heading: 'Vēlmju saraksts',
  addText: 'Pievienot vēlmju sarakstam',
  removeText: 'Noņemt no vēlmju saraksta',
  removeCardText: 'Noņemt',
  productsToAdd: 3,
  empty: {
    title: 'Vēlmju saraksts ir tukšs.',
    text: 'Jūsu vēlmju sarakstā vēl nav neviena produkta.',
    shopHint: 'Mūsu "Veikals" lapā jūs atradīsiet daudz interesantu produktu.',
    button: 'Atgriezties uz veikalu',
    buttonHref: '/veikals/',
  },
};
