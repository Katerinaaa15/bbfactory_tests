import { type Locator, type Page } from '@playwright/test';

/** Login window that slides in from the right after clicking the "Mans konts" icon. */
export class SideLogin {
  readonly root: Locator;
  readonly heading: Locator;
  readonly closeButton: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly lostPasswordLink: Locator;
  readonly rememberMe: Locator;
  readonly createAccountLink: Locator;

  constructor(page: Page) {
    this.root = page.locator('.login-form-side.wd-opened');
    this.heading = this.root.locator('.wd-heading .title');
    this.closeButton = this.root.locator('.close-side-widget a');
    this.usernameInput = this.root.locator('#username');
    this.passwordInput = this.root.locator('#password');
    this.submitButton = this.root.getByRole('button', { name: 'Pieslēgties' });
    this.lostPasswordLink = this.root.locator('a.lost_password');
    this.rememberMe = this.root.locator('.woocommerce-form-login__rememberme');
    this.createAccountLink = this.root.locator('a.create-account-button');
  }

  label(text: string): Locator {
    return this.root.locator('label', { hasText: text }).first();
  }
}
