import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Header } from '../components/Header';
import { MiniCart } from '../components/MiniCart';
import { ProductCard } from '../components/ProductCard';
import { type PriceRange, toRange } from '../utils/price';

export class ProductPage extends BasePage {
  protected readonly path = '/produkts/';

  readonly header: Header;
  readonly miniCart: MiniCart;

  readonly heading: Locator;
  readonly priceBlock: Locator;
  readonly image: Locator;
  readonly optionSelect: Locator;
  readonly quantityInput: Locator;
  readonly increaseButton: Locator;
  readonly addToCartButton: Locator;
  readonly stock: Locator;
  readonly wishlistButton: Locator;

  readonly descriptionTab: Locator;
  readonly descriptionPanel: Locator;

  readonly related: Locator;
  readonly relatedHeading: Locator;
  readonly relatedCards: Locator;
  readonly relatedPrev: Locator;
  readonly relatedNext: Locator;

  readonly instagramHeading: Locator;
  readonly instagramPosts: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    this.miniCart = new MiniCart(page);

    this.heading = page.getByRole('heading', { level: 1 });
    this.priceBlock = page.locator('.entry-summary p.price');
    this.image = page.locator('.woocommerce-product-gallery .wp-post-image').first();
    this.optionSelect = page.locator('form.cart select');
    this.quantityInput = page.locator('form.cart input.qty');
    this.increaseButton = page.locator('form.cart .quantity .plus');
    this.addToCartButton = page.locator('form.cart .single_add_to_cart_button');
    this.stock = page.locator('.woocommerce-variation-availability .stock, .summary .stock').first();

    this.wishlistButton = page.locator('.summary-inner .wd-wishlist-btn a');

    const tabs = page.locator('.woocommerce-tabs');
    this.descriptionTab = tabs.locator('a.wd-nav-link').filter({ hasText: 'Apraksts' }).first();
    this.descriptionPanel = tabs.locator('.woocommerce-Tabs-panel').first();

    this.related = page.locator('.related-products');
    this.relatedHeading = this.related.getByRole('heading', { name: 'Saistītie Produkti', level: 2 });
    this.relatedCards = this.related.locator('.wd-product');
    this.relatedPrev = this.related.locator('.wd-btn-arrow.wd-prev');
    this.relatedNext = this.related.locator('.wd-btn-arrow.wd-next');

    const instagram = page.locator('section.elementor-top-section').filter({
      has: page.getByRole('heading', { name: 'Seko mums Instagram' }),
    });
    this.instagramHeading = instagram.getByRole('heading', { name: 'Seko mums Instagram' });
    this.instagramPosts = instagram.locator('a.sbi_photo');
  }

  async titleText(): Promise<string> {
    return ((await this.heading.textContent()) ?? '').trim();
  }

  async priceRange(): Promise<PriceRange> {
    const amounts = await this.priceBlock
      .locator('.woocommerce-Price-amount bdi')
      .evaluateAll((els) => els.filter((e) => !e.closest('del')).map((e) => e.textContent ?? ''));
    return toRange(amounts);
  }

  /** Text of the first real option of the variation select (the first one is the "Izvēlēties" placeholder). */
  async firstOptionLabel(): Promise<string> {
    const labels = await this.optionSelect.locator('option[value]:not([value=""])').allTextContents();
    return labels[0].trim();
  }

  async selectFirstOption(): Promise<string> {
    const label = await this.firstOptionLabel();
    await this.optionSelect.selectOption({ label });
    return label;
  }

  /** Number n from the "Noliktavā n prece/-es" text. */
  async stockQuantity(): Promise<number> {
    const text = (await this.stock.textContent()) ?? '';
    return Number(text.match(/\d+/)?.[0]);
  }

  /** Adds one to the quantity and returns the resulting value of the quantity input. */
  async increaseQuantity(): Promise<number> {
    await this.increaseButton.click();
    return Number(await this.quantityInput.inputValue());
  }

  relatedCard(index: number): ProductCard {
    return new ProductCard(this.relatedCards.nth(index));
  }

  /** Centers the related products block so the sticky header does not cover the carousel arrows. */
  async scrollRelatedToCenter(): Promise<void> {
    await this.related.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  }

  /** x position of the first carousel slide; changes when the carousel is scrolled. */
  async relatedOffset(): Promise<number> {
    const box = await this.related.locator('.wd-carousel-item').first().boundingBox();
    return Math.round(box?.x ?? 0);
  }
}
