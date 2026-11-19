import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Header } from '../components/Header';

export class LostPasswordPage extends BasePage {
  protected readonly path = '/mans-konts/pazaudeta-parole/';

  readonly header: Header;
  readonly heading: Locator;
  readonly loginInput: Locator;
  readonly loginLabel: Locator;
  readonly submitButton: Locator;
  readonly errors: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    this.heading = page.getByRole('heading', { level: 1 });
    this.loginInput = page.locator('#user_login');
    this.loginLabel = page.locator('label[for="user_login"]');
    this.submitButton = page.getByRole('button', { name: 'Atjaunot paroli' });
    this.errors = page.locator('ul.woocommerce-error li');
  }

  /** Submits the form with the given text and waits for the reloaded page. */
  async submit(text: string): Promise<void> {
    await this.loginInput.fill(text);
    await this.submitButton.click();
  }
}
