import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Header } from '../components/Header';

/** "Mans konts" page with the login and registration forms. */
export class AccountPage extends BasePage {
  protected readonly path = '/mans-konts/';

  readonly header: Header;
  readonly heading: Locator;
  readonly loginTitle: Locator;
  readonly registerTitle: Locator;
  readonly serverErrors: Locator;

  readonly loginForm: Locator;
  readonly loginUsername: Locator;
  readonly loginPassword: Locator;
  readonly loginSubmit: Locator;
  readonly switchToRegister: Locator;

  readonly registerForm: Locator;
  readonly registerEmail: Locator;
  readonly registerPassword: Locator;
  readonly registerSubmit: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    this.heading = page.getByRole('heading', { level: 1 });
    const forms = page.locator('#customer_login');
    this.loginTitle = forms.getByRole('heading', { name: 'Pieteikšanās' });
    this.registerTitle = forms.getByRole('heading', { name: 'Reģistrēties' });
    this.serverErrors = page.locator('.woocommerce-notices-wrapper ul.woocommerce-error li');

    this.loginForm = forms.locator('form.woocommerce-form-login');
    this.loginUsername = this.loginForm.locator('#username');
    this.loginPassword = this.loginForm.locator('#password');
    this.loginSubmit = this.loginForm.getByRole('button', { name: 'Pieslēgties' });
    this.switchToRegister = forms.locator('a.wd-switch-to-register');

    this.registerForm = forms.locator('form.woocommerce-form-register');
    this.registerEmail = this.registerForm.locator('#reg_email');
    this.registerPassword = this.registerForm.locator('#reg_password');
    this.registerSubmit = this.registerForm.getByRole('button', { name: 'Reģistrēties' });
  }

  /** Inline validation message under a field (`span.bbf-field-error` inside the field row). */
  fieldError(form: Locator, input: Locator): Locator {
    return form.locator('p.form-row').filter({ has: input }).locator('.bbf-field-error');
  }

  /** Shows the registration form (it is hidden behind the "Reģistrēties" tab after every page load). */
  async ensureRegisterForm(): Promise<void> {
    if (!(await this.registerForm.isVisible())) await this.switchToRegister.click();
    await expect(this.registerForm).toBeVisible();
  }

  /**
   * Fills the form (`fill`), submits it and waits until the validation message is shown. The inline validation is
   * done by page scripts; a submit before they are ready reloads the page, so everything is repeated until it works.
   */
  async submitUntilVisible(fill: () => Promise<void>, submit: Locator, expected: Locator): Promise<void> {
    await expect(async () => {
      await this.waitForScripts();
      await fill();
      await submit.click();
      await expect(expected.first()).toBeVisible({ timeout: 10_000 });
    }).toPass({ timeout: 150_000 });
  }
}
