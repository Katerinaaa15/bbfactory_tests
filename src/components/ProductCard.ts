import { expect, type Locator } from '@playwright/test';
import { type PriceRange, toRange } from '../utils/price';

/** Product card of the shop grid / carousels (Woodmart `.wd-product`). */
export class ProductCard {
  readonly title: Locator;
  readonly titleLink: Locator;
  readonly wishlistButton: Locator;
  readonly cartButton: Locator;
  readonly quickViewButton: Locator;

  constructor(readonly root: Locator) {
    this.title = root.locator('.wd-entities-title');
    this.titleLink = this.title.getByRole('link');
    this.wishlistButton = root.locator('.wd-wishlist-btn a');
    this.cartButton = root.locator('.wd-add-btn a');
    this.quickViewButton = root.locator('.wd-quick-view-btn a');
  }

  async titleText(): Promise<string> {
    return ((await this.title.textContent()) ?? '').trim();
  }

  /** Price (sale price when discounted) or price range as numbers. */
  async priceRange(): Promise<PriceRange> {
    const amounts = await this.root
      .locator('.price .woocommerce-Price-amount bdi')
      .evaluateAll((els) => els.filter((e) => !e.closest('del')).map((e) => e.textContent ?? ''));
    return toRange(amounts);
  }

  /**
   * Hovers the card. The theme only reveals the card buttons once its scripts are loaded and have marked the
   * card with `hover-ready`, so the mouse is moved again until that happens.
   */
  async hover(): Promise<void> {
    let attempt = 0;
    await expect(async () => {
      attempt += 1;
      await this.root.hover({ position: { x: 20 + attempt * 7, y: 20 + attempt * 5 } });
      await expect(this.root).toHaveClass(/hover-ready/, { timeout: 2_000 });
    }).toPass({ timeout: 45_000 });
  }

  /**
   * Clicks one of the card buttons. The sticky header can cover the buttons of the first product row; Playwright
   * then refuses the click (nothing is clicked), and the click event is dispatched on the button instead.
   */
  async activate(button: Locator): Promise<void> {
    try {
      await button.click({ timeout: 10_000 });
    } catch {
      await button.dispatchEvent('click');
    }
  }
}
