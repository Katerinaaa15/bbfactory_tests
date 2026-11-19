import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Header } from '../components/Header';
import { SideLogin } from '../components/SideLogin';
import { requireEnv } from '../utils/env';

/** "Mans konts" area of a logged-in customer (dashboard, orders, addresses, profile). */
export class MyAccountPage extends BasePage {
  protected readonly path = '/mans-konts/';

  readonly header: Header;
  readonly sideLogin: SideLogin;

  readonly heading: Locator;
  readonly menu: Locator;
  readonly content: Locator;
  readonly errors: Locator;

  // orders
  readonly verifyNotice: Locator;
  readonly ordersTable: Locator;
  readonly orderRows: Locator;

  // order view
  readonly orderIntro: Locator;

  // addresses
  readonly addressIntro: Locator;
  readonly saveAddressButton: Locator;

  // profile
  readonly passwordFieldset: Locator;
  readonly saveProfileButton: Locator;

  constructor(private readonly pageRef: Page) {
    super(pageRef);
    this.header = new Header(pageRef);
    this.sideLogin = new SideLogin(pageRef);

    this.heading = pageRef.getByRole('heading', { level: 1 });
    this.menu = pageRef.locator('.woocommerce-MyAccount-navigation');
    this.content = pageRef.locator('.woocommerce-MyAccount-content');
    this.errors = this.content.locator('.woocommerce-error li');

    this.verifyNotice = this.content.locator('.woocommerce-info');
    this.ordersTable = this.content.locator('table.woocommerce-orders-table');
    this.orderRows = this.ordersTable.locator('tbody tr');

    this.orderIntro = this.content.locator('> p').first();

    this.addressIntro = this.content.locator('> p').first();
    this.saveAddressButton = this.content.getByRole('button', { name: 'Saglabāt adresi' });

    this.passwordFieldset = this.content.locator('fieldset');
    this.saveProfileButton = this.content.getByRole('button', { name: 'Saglabāt izmaiņas' });
  }

  // ---------- login (credentials come from .env and are never logged) ----------

  /** Logs in through the side login window. The customer stays on the current page, logged in. */
  async loginFromSideWindow(): Promise<void> {
    await this.sideLogin.usernameInput.fill(requireEnv('USER_EMAIL'));
    await this.sideLogin.passwordInput.fill(requireEnv('USER_PASSWORD'));
    await this.sideLogin.submitButton.click({ noWaitAfter: true });
    await this.pageRef.waitForFunction(() => document.body?.classList.contains('logged-in'), undefined, {
      timeout: 120_000,
    });
  }

  // ---------- navigation ----------

  menuLink(name: string): Locator {
    return this.menu.getByRole('link', { name, exact: true });
  }

  heading2(name: string): Locator {
    return this.content.getByRole('heading', { name, exact: true });
  }

  // ---------- orders ----------

  columnHeader(name: string): Locator {
    return this.ordersTable.getByRole('columnheader', { name, exact: true });
  }

  orderButton(row: Locator, name: string): Locator {
    return row.getByRole('link', { name, exact: true });
  }

  // ---------- forms ----------

  label(fieldId: string): Locator {
    return this.content.locator(`label[for="${fieldId}"]`);
  }

  input(fieldId: string): Locator {
    return this.content.locator(`#${fieldId}`);
  }

  /** Hint (`<em>`) shown under the "Lietotājvārds" field. */
  displayNameHint(): Locator {
    return this.content.locator('p', { has: this.input('account_display_name') }).locator('em');
  }

  /**
   * Fills the password fields until "Saglabāt izmaiņas" becomes enabled. The button is enabled by page scripts
   * that react to input, so the fields are filled again while the scripts are still loading.
   */
  async fillPasswords(current: string, next: string, confirm: string): Promise<void> {
    await expect(async () => {
      await this.input('password_current').fill(current);
      await this.input('password_1').fill(next);
      await this.input('password_2').fill(confirm);
      await expect(this.saveProfileButton).toBeEnabled({ timeout: 3_000 });
    }).toPass({ timeout: 90_000 });
  }
}
