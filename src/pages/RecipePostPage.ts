import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Single recipe (blog post) page. */
export class RecipePostPage extends BasePage {
  protected readonly path = '/';

  readonly heading: Locator;
  readonly olderLink: Locator;
  readonly newerLink: Locator;
  readonly olderLabel: Locator;
  readonly newerLabel: Locator;
  readonly olderTitle: Locator;
  readonly newerTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1 });
    // "Senāki" = older post (next-btn), "Jaunāki" = newer post (prev-btn)
    this.olderLink = page.locator('.wd-page-nav-btn.next-btn a');
    this.newerLink = page.locator('.wd-page-nav-btn.prev-btn a');
    this.olderLabel = this.olderLink.locator('.wd-label');
    this.newerLabel = this.newerLink.locator('.wd-label');
    this.olderTitle = this.olderLink.locator('.wd-entities-title');
    this.newerTitle = this.newerLink.locator('.wd-entities-title');
  }

  async headingText(): Promise<string> {
    return ((await this.heading.textContent()) ?? '').trim();
  }
}
