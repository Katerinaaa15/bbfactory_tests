import { type Locator, type Page } from '@playwright/test';
import { type PriceRange, toRange } from '../utils/price';

/**
 * Quick view popup of a product (Woodmart / Magnific popup).
 * NOTE: the popup content is loaded via admin-ajax.php (action=woodmart_quick_view). On the live site
 * this request currently answers 404, so the popup never opens and these locators could not be
 * verified against real popup markup. They follow the single product markup used on product pages.
 */
export class QuickView {
  readonly root: Locator;
  readonly title: Locator;
  readonly priceBlock: Locator;
  readonly quantityInput: Locator;
  readonly increaseButton: Locator;
  readonly addToCartButton: Locator;
  readonly optionSelect: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator('.mfp-content .product-quick-view, .mfp-content .wd-popup-quick-view').first();
    this.title = this.root.locator('.product_title');
    this.priceBlock = this.root.locator('p.price');
    this.quantityInput = this.root.locator('input.qty');
    this.increaseButton = this.root.locator('.quantity .plus');
    this.addToCartButton = this.root.locator('.single_add_to_cart_button');
    this.optionSelect = this.root.locator('form.cart select');
  }

  async priceRange(): Promise<PriceRange> {
    const amounts = await this.priceBlock
      .locator('.woocommerce-Price-amount bdi')
      .evaluateAll((els) => els.filter((e) => !e.closest('del')).map((e) => e.textContent ?? ''));
    return toRange(amounts);
  }

  async close(): Promise<void> {
    await this.page.keyboard.press('Escape');
  }
}
