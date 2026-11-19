import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Header } from '../components/Header';
import { RecipeCard } from '../components/RecipeCard';
import { InstagramFeed } from '../components/InstagramFeed';

/** Receptes page and its category archives (same layout). */
export class ReceiptsPage extends BasePage {
  protected readonly path = '/receptes/';

  readonly header: Header;
  readonly heading: Locator;
  readonly posts: Locator;
  readonly loadMoreButton: Locator;
  readonly sidebar: Locator;
  readonly categoriesWidget: Locator;
  readonly instagram: InstagramFeed;

  constructor(page: Page, instagramHeading = 'Seko mums Instagram') {
    super(page);
    this.header = new Header(page);
    this.heading = page.getByRole('heading', { level: 1 });
    this.posts = page.locator('article.wd-post');
    this.loadMoreButton = page.locator('a.wd-load-more');
    this.sidebar = page.locator('aside.sidebar-container');
    this.categoriesWidget = this.sidebar.locator('.widget_categories');
    this.instagram = new InstagramFeed(page, instagramHeading);
  }

  post(index: number): RecipeCard {
    return new RecipeCard(this.posts.nth(index));
  }

  categoryLink(name: string): Locator {
    return this.categoriesWidget.getByRole('link', { name, exact: true });
  }

  async titles(): Promise<string[]> {
    const titles = await this.posts.locator('.wd-post-title a').allTextContents();
    return titles.map((t) => t.trim());
  }
}
