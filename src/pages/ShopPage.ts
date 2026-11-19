import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { QuickView } from '../components/QuickView';
import { MiniCart } from '../components/MiniCart';

export class ShopPage extends BasePage {
  protected readonly path = '/veikals/';

  readonly header: Header;
  readonly quickView: QuickView;
  readonly miniCart: MiniCart;

  readonly heading: Locator;
  readonly priceFilterHeading: Locator;
  readonly maxPriceInput: Locator;
  readonly sortSelect: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    this.quickView = new QuickView(page);
    this.miniCart = new MiniCart(page);

    this.heading = page.getByRole('heading', { level: 1 });
    this.priceFilterHeading = page.getByRole('heading', { name: 'Filtrēt pēc cenas' });
    this.maxPriceInput = page.getByRole('textbox', { name: 'Filter products by maximum price' });
    this.sortSelect = page.getByRole('combobox', { name: 'Shop order' });
    this.productCards = page.locator('.wd-product');
  }

  card(index: number): ProductCard {
    return new ProductCard(this.productCards.nth(index));
  }

  /** Types the maximum price into the "Filtrēt pēc cenas" filter and waits until the list is reloaded. */
  async setMaxPrice(value: number, urlParam: RegExp): Promise<void> {
    await this.maxPriceInput.scrollIntoViewIfNeeded();
    await this.maxPriceInput.fill(String(value));
    await this.maxPriceInput.press('Enter');
    await this.page.waitForURL(urlParam);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Chooses a sorting option by its label.
   * After the price filter reloads the list, the theme does not re-bind the "change" handler of the
   * sorting form, so choosing an option alone does nothing. When no navigation follows the selection
   * the (already updated) sorting form is submitted, exactly like the theme does on change.
   */
  async sortBy(label: string, urlParam: RegExp): Promise<void> {
    const firstBefore = await this.card(0).titleText();
    await this.sortSelect.selectOption({ label });
    const reacted = await this.page
      .waitForURL(urlParam, { timeout: 5_000 })
      .then(() => true)
      .catch(() => false);
    if (!reacted) {
      await this.sortSelect.evaluate((el) => (el as HTMLSelectElement).form?.requestSubmit());
      await this.page.waitForURL(urlParam);
    }
    await this.page.waitForLoadState('load');
    // the product list is refreshed asynchronously: wait until the first product has changed
    await expect.poll(() => this.card(0).titleText(), { timeout: 30_000 }).not.toBe(firstBefore);
  }

  async openQuickView(card: ProductCard): Promise<void> {
    // the theme binds the quick view handler after load; clicking earlier would follow the link instead
    await this.page.waitForLoadState('networkidle');
    await card.hover();
    await card.activate(card.quickViewButton);
  }

  /** Clicks "Pievienot grozam" on a simple product card and waits until the side cart lists the product. */
  async addToCart(card: ProductCard): Promise<void> {
    await this.waitForScripts();
    // centre the card first: scrolling after the hover would un-hover it and hide the buttons
    await card.root.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await card.hover();
    await card.activate(card.cartButton);
    await this.miniCart.item((await card.titleText()).trim()).first().waitFor({ timeout: 60_000 });
  }

  async openProduct(card: ProductCard): Promise<void> {
    await card.titleLink.click({ noWaitAfter: true });
  }
}
