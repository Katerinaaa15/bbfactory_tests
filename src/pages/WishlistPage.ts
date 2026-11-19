import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';

export class WishlistPage extends BasePage {
  protected readonly path = '/velmju-saraksts/';

  readonly header: Header;
  readonly heading: Locator;
  readonly cards: Locator;
  readonly emptyBlock: Locator;
  readonly emptyTitle: Locator;
  readonly emptyText: Locator;
  readonly returnToShopButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    this.heading = page.getByRole('heading', { level: 1 });
    this.cards = page.locator('.wd-wishlist-content .wd-product');
    this.emptyBlock = page.locator('.wd-empty-wishlist');
    this.emptyTitle = this.emptyBlock.locator('.wd-empty-block-title');
    this.emptyText = this.emptyBlock.locator('.wd-empty-block-text');
    this.returnToShopButton = this.emptyBlock.locator('a.wd-empty-block-btn');
  }

  card(title: string): ProductCard {
    return new ProductCard(this.cards.filter({ has: this.cards.page().getByRole('heading', { name: title, exact: true }) }));
  }

  removeButton(card: Locator): Locator {
    return card.locator('.wd-wishlist-product-remove a');
  }

  async titles(): Promise<string[]> {
    return (await this.cards.locator('.wd-entities-title').allTextContents()).map((t) => t.trim());
  }
}
