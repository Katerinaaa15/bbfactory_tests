import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Header } from '../components/Header';
import { MiniCart } from '../components/MiniCart';
import { parseAmount } from '../utils/price';

export class CartPage extends BasePage {
  protected readonly path = '/grozs/';

  readonly header: Header;
  readonly miniCart: MiniCart;

  readonly rows: Locator;
  readonly updateButton: Locator;
  readonly cartMessage: Locator;

  readonly couponInput: Locator;
  readonly couponButton: Locator;
  readonly couponNotice: Locator;

  readonly totals: Locator;
  readonly totalsHeading: Locator;
  readonly checkoutButton: Locator;

  readonly shippingRow: Locator;
  readonly terminalSelect: Locator;
  readonly shippingToggle: Locator;
  readonly shippingForm: Locator;
  readonly countrySelection: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly postcodeInput: Locator;
  readonly shippingUpdateButton: Locator;
  readonly cityError: Locator;
  readonly postcodeError: Locator;

  constructor(private readonly pageRef: Page) {
    super(pageRef);
    this.header = new Header(pageRef);
    this.miniCart = new MiniCart(pageRef);

    this.rows = pageRef.locator('tr.cart_item');
    this.updateButton = pageRef.getByRole('button', { name: 'Atjaunināt grozu' });
    this.cartMessage = pageRef.locator('.woocommerce-message');

    this.couponInput = pageRef.locator('#coupon_code');
    this.couponButton = pageRef.getByRole('button', { name: 'Izmantot kuponu' });
    this.couponNotice = pageRef.locator('.coupon .coupon-error-notice');

    this.totals = pageRef.locator('.cart_totals');
    this.totalsHeading = this.totals.getByRole('heading', { level: 2 });
    this.checkoutButton = this.totals.getByRole('link', { name: 'Turpināt noformēt pirkumu' });

    this.shippingRow = this.totals.locator('tr.woocommerce-shipping-totals');
    this.terminalSelect = pageRef.locator('select.omnivalt_terminal');
    const calc = this.shippingRow.locator('.woocommerce-shipping-calculator');
    this.shippingToggle = calc.locator('.shipping-calculator-button');
    this.shippingForm = calc.locator('.shipping-calculator-form');
    this.countrySelection = calc.locator('#calc_shipping_country_field .select2-selection');
    this.stateInput = calc.locator('#calc_shipping_state');
    this.cityInput = calc.locator('#calc_shipping_city');
    this.postcodeInput = calc.locator('#calc_shipping_postcode');
    this.shippingUpdateButton = calc.getByRole('button', { name: 'Atjaunot' });
    this.cityError = calc.locator('#calc_shipping_city_field .bbf-field-error');
    this.postcodeError = calc.locator('#calc_shipping_postcode_field .bbf-field-error');
  }

  // ---------- products ----------

  row(title: string): Locator {
    return this.rows.filter({ has: this.pageRef.locator('.product-name a', { hasText: title }) });
  }

  rowPrice(row: Locator): Locator {
    return row.locator('.product-price .woocommerce-Price-amount');
  }

  rowQuantity(row: Locator): Locator {
    return row.locator('input.qty');
  }

  rowSubtotal(row: Locator): Locator {
    return row.locator('.product-subtotal .woocommerce-Price-amount');
  }

  async amount(locator: Locator): Promise<number> {
    return parseAmount((await locator.first().textContent()) ?? '');
  }

  /**
   * Increases the quantity of a product with "+" and presses "Atjaunināt grozu". The update runs through ajax once
   * the page scripts are ready; before that the click would only submit the form, so the action is repeated until
   * the "Grozs atjaunināts." message is shown.
   */
  async setQuantity(title: string, quantity: number): Promise<void> {
    await expect(async () => {
      await this.waitForScripts();
      const row = this.row(title);
      await this.rowQuantity(row).fill(String(quantity - 1));
      await row.locator('.plus').click();
      await expect(this.rowQuantity(row)).toHaveValue(String(quantity));
      await this.updateButton.click();
      await expect(this.cartMessage).toBeVisible({ timeout: 20_000 });
    }).toPass({ timeout: 90_000 });
  }

  // ---------- coupon ----------

  /** Applies a coupon code and waits for the error notice (repeated until the page scripts are ready). */
  async applyCoupon(code: string): Promise<void> {
    await expect(async () => {
      await this.waitForScripts();
      await this.couponInput.fill(code);
      await this.couponButton.click();
      await expect(this.couponNotice).toBeVisible({ timeout: 20_000 });
    }).toPass({ timeout: 90_000 });
  }

  // ---------- totals ----------

  totalsRow(name: string): Locator {
    return this.totals.locator('tr').filter({ has: this.pageRef.getByRole('rowheader', { name, exact: true }) });
  }

  totalsAmount(name: string): Locator {
    return this.totalsRow(name).locator('td .woocommerce-Price-amount').first();
  }

  get shippingCost(): Locator {
    return this.shippingRow.locator('.woocommerce-shipping-methods label .woocommerce-Price-amount');
  }

  // ---------- shipping ----------

  /** Selects the first real parcel terminal and returns its name. */
  async selectFirstTerminal(): Promise<string> {
    await this.terminalSelect.selectOption({ index: 1 });
    const name = await this.terminalSelect.evaluate((el: HTMLSelectElement) => el.options[el.selectedIndex].text);
    return name.trim();
  }

  /** Opens the shipping address form ("Aprēķināt piegādi" / "Mainīt adresi"). */
  async openShippingForm(): Promise<void> {
    await expect(async () => {
      await this.waitForScripts();
      if (!(await this.shippingForm.isVisible())) await this.shippingToggle.click();
      await expect(this.shippingForm).toBeVisible({ timeout: 3_000 });
    }).toPass({ timeout: 60_000 });
  }

  async chooseCountry(name: string): Promise<void> {
    await this.countrySelection.click();
    await this.pageRef.locator('.select2-results__option', { hasText: name }).first().click();
  }
}
