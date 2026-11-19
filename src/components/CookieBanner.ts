import { type Locator, type Page } from '@playwright/test';

export class CookieBanner {
  readonly banner: Locator;
  readonly acceptAll: Locator;

  constructor(private readonly page: Page) {
    this.banner = page.locator('#cookie-law-info-bar');
    this.acceptAll = page.getByRole('button', { name: 'Piekrist visam' });
  }

  /**
   * The site only renders the banner after the first user interaction in some browsers
   * (observed in Chromium), so a mouse move is made before clicking "Piekrist visam".
   */
  async accept(): Promise<void> {
    await this.page.mouse.move(300, 300);
    await this.acceptAll.click();
  }
}
