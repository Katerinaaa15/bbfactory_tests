import { type Locator, type Page } from '@playwright/test';

export class Footer {
  readonly root: Locator;
  readonly logoLink: Locator;
  readonly phoneLink: Locator;
  readonly emailLink: Locator;
  readonly facebookLink: Locator;
  readonly instagramLink: Locator;
  readonly developerLink: Locator;

  constructor(page: Page) {
    this.root = page.locator('footer.wd-footer');
    this.logoLink = this.root.locator('a[href="https://bbfactory.lv"]');
    this.phoneLink = this.root.locator('a[href^="tel:"]');
    this.emailLink = this.root.locator('a[href^="mailto:"]');
    this.facebookLink = this.root.locator('a[href*="facebook.com"]');
    this.instagramLink = this.root.locator('a[href*="instagram.com"]');
    this.developerLink = this.root.getByRole('link', { name: 'WD Market' });
  }

  link(name: string): Locator {
    return this.root.getByRole('link', { name, exact: true });
  }

  heading(name: string): Locator {
    return this.root.getByRole('heading', { name });
  }
}
