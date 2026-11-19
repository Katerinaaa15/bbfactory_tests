import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Header } from '../components/Header';

export class CheckoutPage extends BasePage {
  protected readonly path = '/pasutijums/';

  readonly header: Header;

  readonly loginToggle: Locator;
  readonly loginForm: Locator;

  readonly couponToggle: Locator;
  readonly couponForm: Locator;
  readonly couponInput: Locator;
  readonly couponButton: Locator;
  readonly couponNotice: Locator;

  readonly form: Locator;
  readonly billingFields: Locator;
  readonly additionalFields: Locator;
  readonly errors: Locator;

  readonly orderReview: Locator;
  readonly terminalDropdown: Locator;
  readonly terminalOptions: Locator;
  readonly terms: Locator;
  readonly termsLabel: Locator;
  readonly placeOrderButton: Locator;

  readonly page: Page;

  constructor(private readonly pageRef: Page) {
    super(pageRef);
    this.page = pageRef;
    this.header = new Header(pageRef);

    this.loginToggle = pageRef.getByRole('link', { name: 'Klikšķiniet te, lai autorizētos' });
    this.loginForm = pageRef.locator('.woocommerce-form-login-toggle + form.woocommerce-form-login');

    this.couponToggle = pageRef.getByText('Spied šeit, lai ievadītu kupona kodu');
    this.couponForm = pageRef.locator('form.checkout_coupon');
    this.couponInput = this.couponForm.locator('#coupon_code');
    this.couponButton = this.couponForm.getByRole('button', { name: 'Izmantot kuponu' });
    this.couponNotice = pageRef.locator('.coupon-error-notice');

    this.form = pageRef.locator('form.woocommerce-checkout');
    this.billingFields = this.form.locator('.woocommerce-billing-fields');
    this.additionalFields = this.form.locator('.woocommerce-additional-fields');
    this.errors = pageRef.locator('ul.woocommerce-error li');

    this.orderReview = pageRef.locator('#order_review');
    this.terminalDropdown = pageRef.locator('.omniva-terminals-list .dropdown');
    this.terminalOptions = pageRef.locator('.omniva-terminals-list li[data-id]');
    this.terms = pageRef.locator('#terms');
    this.termsLabel = pageRef.locator('label.woocommerce-form__label-for-checkbox').filter({ has: this.terms });
    this.placeOrderButton = pageRef.locator('#place_order');
  }

  // ---------- toggles ----------

  /**
   * Opens or closes a toggled form ("Klikšķiniet te, lai autorizētos" / "Spied šeit, lai ievadītu kupona kodu").
   * The toggle only reacts after the page scripts are ready, so the click is repeated until the state matches.
   */
  async setToggle(toggle: Locator, form: Locator, open: boolean): Promise<void> {
    await expect(async () => {
      await this.waitForScripts();
      if ((await form.isVisible()) !== open) await toggle.click();
      if (open) await expect(form).toBeVisible({ timeout: 3_000 });
      else await expect(form).toBeHidden({ timeout: 3_000 });
    }).toPass({ timeout: 60_000 });
  }

  /** Applies a coupon and waits for the error notice (repeated until the page scripts are ready). */
  async applyCoupon(code: string): Promise<void> {
    await expect(async () => {
      await this.waitForScripts();
      await this.couponInput.fill(code);
      await this.couponButton.click();
      await expect(this.couponNotice).toBeVisible({ timeout: 20_000 });
    }).toPass({ timeout: 90_000 });
  }

  // ---------- fields ----------

  /** Wrapper (`<p class="form-row">`) of a billing field, e.g. `field('billing_first_name')`. */
  field(name: string): Locator {
    return this.pageRef.locator(`#${name}_field`);
  }

  /** Wrapper of a field by its full id, e.g. `billing_first_name_field`. */
  pageField(id: string): Locator {
    return this.pageRef.locator(`#${id}`);
  }

  input(name: string): Locator {
    return this.pageRef.locator(`#${name}`);
  }

  label(name: string): Locator {
    return this.field(name).locator('label').first();
  }

  /** Waits until the order review is no longer being recalculated. */
  async waitForOrderReview(): Promise<void> {
    await expect(this.pageRef.locator('.blockUI')).toHaveCount(0, { timeout: 45_000 });
  }

  async fill(name: string, value: string): Promise<void> {
    await this.input(name).fill(value);
  }

  async chooseCountry(name: string): Promise<void> {
    await this.field('billing_country').locator('.select2-selection').click();
    await this.pageRef.locator('.select2-results__option', { hasText: name }).first().click();
  }

  // ---------- shipping ----------

  /** Chooses an Omniva parcel terminal different from the preselected one; returns its name. */
  async selectAnotherTerminal(): Promise<string> {
    await this.terminalDropdown.click();
    const option = this.pageRef.locator('.omniva-terminals-list li[data-id]:not(.selected)').first();
    const name = ((await option.textContent()) ?? '').replace(/\s*[\d.]+km\s*$/, '').trim();
    await option.click();
    return name;
  }

  // ---------- payment ----------

  paymentMethod(name: string): Locator {
    return this.pageRef.locator('.wc_payment_methods > li > label').filter({ hasText: name });
  }

  /** Presses "Veikt pasūtījumu" and waits for the validation list; repeated until the page scripts react. */
  async placeOrderExpectingErrors(): Promise<void> {
    await expect(async () => {
      await this.waitForScripts();
      await this.placeOrderButton.click();
      await expect(this.errors.first()).toBeVisible({ timeout: 45_000 });
    }).toPass({ timeout: 150_000 });
  }
}
