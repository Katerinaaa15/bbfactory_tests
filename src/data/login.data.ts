import { titleOf } from './homepage.data';

export const SIDE_LOGIN = {
  heading: 'Ienākt',
  labels: ['Lietotājvārds vai e-pasta adrese', 'Parole'],
  submit: 'Pieslēgties',
  lostPassword: 'Aizmirsi paroli?',
  createAccount: 'Izveidot kontu',
  createAccountHref: '/mans-konts/?action=register',
  rememberMe: 'Atcerēties mani',
};

export const LOST_PASSWORD = {
  path: '/mans-konts/pazaudeta-parole/',
  title: titleOf('Mans konts'),
  heading: 'Pazaudēta parole',
  label: 'Lietotājvārds vai e-pasts',
  submit: 'Atjaunot paroli',
  randomText: 'abc random text',
  notRegisteredEmail: 'random.not.registered.12345@example.com',
  invalidMessage: 'Nederīgs lietotājvārds vai e-pasts.',
};

export const ACCOUNT = {
  path: '/mans-konts/',
  title: titleOf('Mans konts'),
  heading: 'Mans konts',
  loginTitle: 'Pieteikšanās',
  registerTitle: 'Reģistrēties',
  login: {
    submit: 'Pieslēgties',
    usernameRequired: 'Lūdzu, ievadiet lietotājvārdu vai e-pasta adresi.',
    passwordRequired: 'Lūdzu, ievadiet paroli.',
    email: 'random@example.com',
    unknownUser: 'kjoj',
    password: 'Secret123!x',
    unknownUserMessage:
      'Kļūda: lietotājvārds kjoj nav reģistrēts šajā vietnē. Ja neesat pārliecināts par savu lietotājvārdu, tā vietā mēģiniet izmantot savu e-pasta adresi.',
  },
  register: {
    submit: 'Reģistrēties',
    emailRequired: 'Lūdzu, ievadiet e-pasta adresi.',
    passwordRequired: 'Lūdzu, ievadiet paroli.',
    email: 'random.test@example.com',
  },
};
