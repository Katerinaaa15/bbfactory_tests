import { type Locator, type Page } from '@playwright/test';

/** "Seko mums Instagram" section (Smash Balloon feed). */
export class InstagramFeed {
  readonly root: Locator;
  readonly heading: Locator;
  readonly posts: Locator;

  constructor(page: Page, headingText: string) {
    this.heading = page.getByRole('heading', { name: headingText, level: 2 });
    this.root = page.locator('section.elementor-top-section').filter({ has: this.heading });
    this.posts = this.root.locator('a.sbi_photo');
  }
}
