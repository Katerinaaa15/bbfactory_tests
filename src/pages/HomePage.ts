import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CookieBanner } from '../components/CookieBanner';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SideLogin } from '../components/SideLogin';

export class HomePage extends BasePage {
  protected readonly path = '/';

  readonly cookies: CookieBanner;
  readonly header: Header;
  readonly footer: Footer;
  readonly sideLogin: SideLogin;

  constructor(page: Page) {
    super(page);
    this.cookies = new CookieBanner(page);
    this.header = new Header(page);
    this.footer = new Footer(page);
    this.sideLogin = new SideLogin(page);
  }

  // ---------- generic helpers ----------

  /** Top-level Elementor section that contains the given heading */
  private sectionWithHeading(heading: Locator): Locator {
    return this.page.locator('section.elementor-top-section').filter({ has: heading });
  }

  private headingIn(name: string | RegExp, level?: number): Locator {
    return this.page.getByRole('heading', { name, level });
  }

  async openWithCookiesAccepted(): Promise<void> {
    await this.open();
    await this.cookies.accept();
  }

  /** Clicks the "Mans konts" icon; once the page scripts are loaded it opens the side login window. */
  async openSideLogin(): Promise<void> {
    await this.waitForScripts();
    await this.header.iconLink('/mans-konts/').click({ noWaitAfter: true });
  }

  // ---------- hero ----------

  get hero(): Locator {
    return this.sectionWithHeading(this.page.getByRole('heading', { level: 1 }));
  }

  get heroHeading(): Locator {
    return this.hero.getByRole('heading', { level: 1 });
  }

  // ---------- sections ----------

  /** The title of these sections is split into two <h2> elements, e.g. "Dabiskās" + "eļļas". */
  private sectionWithHeadings(headings: string[]): Locator {
    return headings.reduce(
      (section, name) => section.filter({ has: this.page.getByRole('heading', { name, level: 2, exact: true }) }),
      this.page.locator('section.elementor-top-section'),
    );
  }

  oilsSection(headings: string[]): Locator {
    return this.sectionWithHeadings(headings);
  }

  basesSection(headings: string[]): Locator {
    return this.sectionWithHeadings(headings);
  }

  promoSection(heading: string): Locator {
    return this.sectionWithHeading(this.headingIn(heading, 2));
  }

  /** Category promo banner link, identified by its href */
  categoryBanner(path: string): Locator {
    return this.page.locator(`a.wd-promo-banner-link[href$="${path}"]`);
  }

  // ---------- product cards ----------

  productCards(): Locator {
    return this.page.locator('.wd-product');
  }

  productCard(title: string): Locator {
    return this.productCards().filter({
      has: this.page.getByRole('heading', { name: title, exact: true }),
    });
  }

  wishlistButton(card: Locator): Locator {
    return card.locator('.wd-wishlist-btn a');
  }

  cartButton(card: Locator): Locator {
    return card.locator('.wd-add-btn a');
  }

  quickViewButton(card: Locator): Locator {
    return card.locator('.wd-quick-view-btn a');
  }

  /** "Izpārdots" label inside a card */
  soldOutLabel(card: Locator): Locator {
    return card.locator('.product-label.out-of-stock');
  }

  allProductLabels(): Locator {
    return this.page.locator('.wd-product .product-label');
  }

  // ---------- recipes ----------

  get recipesSection(): Locator {
    return this.sectionWithHeading(this.headingIn('Receptes', 2));
  }

  recipeCard(title: string): Locator {
    return this.recipesSection.locator('article.wd-post').filter({
      has: this.page.getByRole('heading', { name: title, exact: true }),
    });
  }

  recipeTitleLink(title: string): Locator {
    return this.recipeCard(title).getByRole('heading', { name: title, exact: true }).getByRole('link');
  }

  recipeShareLink(title: string, network: 'facebook' | 'twitter' | 'linkedin'): Locator {
    return this.recipeCard(title).locator(`a.social-${network}`);
  }

  get recipesNextArrow(): Locator {
    return this.recipesSection.locator('.wd-btn-arrow.wd-next');
  }

  /** Slides the recipes carousel until the recipe title link is inside the viewport. */
  async revealRecipe(title: string): Promise<void> {
    const link = this.recipeTitleLink(title);
    await this.recipesSection.scrollIntoViewIfNeeded();
    for (let i = 0; i < 12; i++) {
      const inView = await link.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return r.left >= 0 && r.right <= window.innerWidth;
      });
      if (inView) return;
      await this.recipesNextArrow.click();
      await this.page.waitForTimeout(600); // carousel slide animation
    }
  }

  async openRecipe(title: string): Promise<void> {
    await this.revealRecipe(title);
    await this.recipeTitleLink(title).click({ noWaitAfter: true });
  }

  // ---------- reviews ----------

  get reviewsSection(): Locator {
    return this.sectionWithHeading(this.headingIn(/^Ko mūsu\s+klienti\s+saka$/, 2));
  }

  /** Original (non-cloned) review slides of the carousel */
  get reviewSlides(): Locator {
    return this.reviewsSection.locator('.swiper-slide:not(.swiper-slide-duplicate)');
  }

  // ---------- instagram ----------

  get instagramSection(): Locator {
    return this.sectionWithHeading(this.headingIn('Seko mums Instagram', 2));
  }

  get instagramPosts(): Locator {
    return this.instagramSection.locator('a.sbi_photo');
  }

  async scrollTo(section: Locator): Promise<void> {
    await section.scrollIntoViewIfNeeded();
  }
}
