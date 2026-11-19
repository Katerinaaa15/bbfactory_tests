import { type Locator, type Page } from '@playwright/test';
import { parseAmount } from '../utils/price';

/** Side shopping cart (opens on the right after a product is added). */
export class MiniCart {
  readonly root: Locator;
  readonly items: Locator;
  readonly closeButton: Locator;
  readonly viewCartButton: Locator;
  readonly checkoutButton: Locator;
  readonly total: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator('.cart-widget-side.wd-opened');
    this.items = this.root.locator('li.woocommerce-mini-cart-item');
    this.closeButton = this.root.locator('.close-side-widget a');
    this.viewCartButton = this.root.getByRole('link', { name: 'Apskatīt grozu' });
    this.checkoutButton = this.root.getByRole('link', { name: 'Veikt pasūtījumu' });
    this.total = this.root.locator('.woocommerce-mini-cart__total .woocommerce-Price-amount');
  }

  item(title: string): Locator {
    return this.items.filter({ has: this.page.locator('.wd-entities-title', { hasText: title }) });
  }

  itemTitle(item: Locator): Locator {
    return item.locator('.wd-entities-title');
  }

  /** "2 × €4.80" line */
  itemQuantityAndPrice(item: Locator): Locator {
    return item.locator('.cart-info .quantity');
  }

  /** Unit price of a mini cart item, e.g. 9.95 from "1 × €9.95". */
  async itemUnitPrice(item: Locator): Promise<number> {
    return parseAmount((await item.locator('.cart-info .woocommerce-Price-amount').textContent()) ?? '');
  }

  async totalAmount(): Promise<number> {
    return parseAmount((await this.total.textContent()) ?? '');
  }
}
