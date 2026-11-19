import { type Locator, type Page } from '@playwright/test';

export class Header {
  readonly root: Locator;
  readonly phoneLink: Locator;
  readonly logo: Locator;
  readonly mainMenu: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator('header.whb-header');
    this.phoneLink = this.root.locator('a[href^="tel:"]');
    this.logo = this.root.locator('a.wd-main-logo:visible');
    this.mainMenu = page.getByRole('navigation', { name: 'Main menu LV' });
  }

  menuItem(name: string): Locator {
    return this.mainMenu.getByRole('link', { name, exact: true });
  }

  /** Clicks a main menu item. The page load is awaited by the URL/title assertions of the caller. */
  async openMenu(name: string): Promise<void> {
    await this.menuItem(name).click({ noWaitAfter: true });
  }

  /** Account / wishlist / cart icon link by its path */
  iconLink(path: string): Locator {
    return this.root.locator(`a[href$="${path}"]:visible`);
  }

  topBarText(text: string): Locator {
    return this.root.getByText(text);
  }
}
