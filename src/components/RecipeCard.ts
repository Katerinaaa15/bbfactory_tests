import { type Locator } from '@playwright/test';

/** Blog post card on the Receptes page / category archives (Woodmart `article.wd-post`). */
export class RecipeCard {
  readonly image: Locator;
  readonly titleLink: Locator;
  readonly readMoreLink: Locator;
  readonly shareButton: Locator;
  readonly shareTooltip: Locator;

  constructor(readonly root: Locator) {
    this.image = root.locator('.wd-post-img img');
    this.titleLink = root.locator('.wd-post-title a');
    this.readMoreLink = root.locator('.wd-post-read-more a');
    this.shareButton = root.locator('.wd-post-share');
    this.shareTooltip = root.locator('.wd-post-share .tooltip');
  }

  shareLink(network: 'facebook' | 'twitter' | 'linkedin'): Locator {
    return this.root.locator(`a.social-${network}`);
  }

  async titleText(): Promise<string> {
    return ((await this.titleLink.textContent()) ?? '').trim();
  }

  async url(): Promise<string> {
    return (await this.titleLink.getAttribute('href')) ?? '';
  }
}
