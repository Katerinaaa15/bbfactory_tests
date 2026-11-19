import { test, expect } from '../src/fixtures';
import {
  BASE,
  BASES_SECTION,
  CATEGORY_BANNERS,
  FOOTER,
  HEADER,
  HERO,
  HOME_TITLE,
  INSTAGRAM,
  MAIN_MENU,
  OILS_SECTION,
  PROMO_SECTION,
  RECIPES,
  REVIEWS,
  SOLD_OUT_LABEL,
  SOLD_OUT_PRODUCTS,
  shareLinks,
} from '../src/data/homepage.data';

test.describe('Home page: cookies', () => {
  test('cookie banner can be accepted', async ({ homePage }) => {
    await homePage.open();
    await homePage.cookies.accept();
    await expect(homePage.cookies.banner).toBeHidden();
  });
});

test.describe('Home page', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.openWithCookiesAccepted();
  });

  test.describe('Header', () => {
    test('page title is correct', async ({ page }) => {
      await expect(page).toHaveTitle(HOME_TITLE);
    });

    test('top bar shows info texts', async ({ homePage }) => {
      for (const text of HEADER.topBarTexts) {
        await expect(homePage.header.topBarText(text)).toBeVisible();
      }
    });

    test('top phone link is a correct tel link', async ({ homePage }) => {
      const phone = homePage.header.phoneLink;
      await expect(phone).toBeVisible();
      await expect(phone).toHaveText(HEADER.phoneText);
      await expect(phone).toHaveAttribute('href', HEADER.phoneHref);
    });

    test('logo leads to the home page', async ({ homePage }) => {
      await expect(homePage.header.logo).toHaveAttribute('href', `${BASE}/`);
    });

    for (const icon of HEADER.iconLinks) {
      test(`header ${icon.name} icon links to ${icon.path}`, async ({ homePage }) => {
        await expect(homePage.header.iconLink(icon.path)).toHaveAttribute('href', `${BASE}${icon.path}`);
      });
    }

    test('main menu contains all categories in order', async ({ homePage }) => {
      await expect(homePage.header.mainMenu.getByRole('link')).toHaveText(MAIN_MENU.map((m) => m.name));
    });

    for (const item of MAIN_MENU) {
      test(`main menu "${item.name}" opens the page with correct title`, async ({ homePage, page }) => {
        const link = homePage.header.menuItem(item.name);
        await expect(link).toHaveAttribute('href', `${BASE}${item.path}`);
        await link.click({ noWaitAfter: true });
        await expect(page).toHaveURL(`${BASE}${item.path}`, { timeout: 60_000 });
        await expect(page).toHaveTitle(item.title);
      });
    }
  });

  test.describe('Hero section', () => {
    test('shows heading and description', async ({ homePage }) => {
      await expect(homePage.heroHeading).toHaveText(HERO.heading);
      await expect(homePage.hero).toContainText(HERO.subtitle);
      await expect(homePage.hero).toContainText(HERO.description);
    });

    test(`"${HERO.button.name}" button opens the shop`, async ({ homePage, page }) => {
      await homePage.hero.getByRole('link', { name: HERO.button.name }).click({ noWaitAfter: true });
      await expect(page).toHaveURL(`${BASE}${HERO.button.path}`, { timeout: 60_000 });
      await expect(page).toHaveTitle(HERO.button.title);
    });
  });

  test.describe('Oils section', () => {
    test('shows heading and product cards', async ({ homePage }) => {
      const section = homePage.oilsSection(OILS_SECTION.headings);
      await expect(section).toBeVisible();
      for (const title of OILS_SECTION.products) {
        await expect(homePage.productCard(title)).toBeVisible();
      }
    });

    test(`"${OILS_SECTION.viewAll.name}" opens the oils category`, async ({ homePage, page }) => {
      const link = homePage.oilsSection(OILS_SECTION.headings).getByRole('link', { name: OILS_SECTION.viewAll.name });
      await link.click({ noWaitAfter: true });
      await expect(page).toHaveURL(`${BASE}${OILS_SECTION.viewAll.path}`, { timeout: 60_000 });
      await expect(page).toHaveTitle(OILS_SECTION.viewAll.title);
    });
  });

  test.describe('Category banners', () => {
    test('all category banners are shown', async ({ homePage }) => {
      for (const banner of CATEGORY_BANNERS) {
        await expect(homePage.categoryBanner(banner.path)).toBeVisible();
      }
    });

    for (const banner of CATEGORY_BANNERS) {
      test(`banner "${banner.label}" opens the category page`, async ({ homePage, page }) => {
        const link = homePage.categoryBanner(banner.path);
        await link.click({ noWaitAfter: true });
        await expect(page).toHaveURL(`${BASE}${banner.path}`, { timeout: 60_000 });
        await expect(page).toHaveTitle(banner.title);
      });
    }
  });

  test.describe('Cosmetic bases section', () => {
    test('shows heading and product cards', async ({ homePage }) => {
      await expect(homePage.basesSection(BASES_SECTION.headings)).toBeVisible();
      for (const title of BASES_SECTION.products) {
        await expect(homePage.productCard(title)).toBeVisible();
      }
    });

    test(`"${BASES_SECTION.viewAll.name}" opens the cosmetics laboratory category`, async ({ homePage, page }) => {
      const link = homePage
        .basesSection(BASES_SECTION.headings)
        .getByRole('link', { name: BASES_SECTION.viewAll.name });
      await link.click({ noWaitAfter: true });
      await expect(page).toHaveURL(`${BASE}${BASES_SECTION.viewAll.path}`, { timeout: 60_000 });
      await expect(page).toHaveTitle(BASES_SECTION.viewAll.title);
    });
  });

  test.describe('Promo section', () => {
    test('shows heading and benefits', async ({ homePage }) => {
      const section = homePage.promoSection(PROMO_SECTION.heading);
      await expect(section).toBeVisible();
      for (const feature of PROMO_SECTION.features) {
        await expect(section.getByRole('heading', { name: feature })).toBeVisible();
      }
    });

    test(`"${PROMO_SECTION.button.name}" button opens the shop`, async ({ homePage, page }) => {
      await homePage
        .promoSection(PROMO_SECTION.heading)
        .getByRole('link', { name: PROMO_SECTION.button.name })
        .click({ noWaitAfter: true });
      await expect(page).toHaveURL(`${BASE}${PROMO_SECTION.button.path}`, { timeout: 60_000 });
      await expect(page).toHaveTitle(PROMO_SECTION.button.title);
    });
  });

  test.describe('Product cards', () => {
    const titles = [...OILS_SECTION.products, ...BASES_SECTION.products];

    test('home page shows all product cards', async ({ homePage }) => {
      await expect(homePage.productCards()).toHaveCount(titles.length);
    });

    for (const title of titles) {
      test(`card "${title}" shows wishlist, cart and quick view buttons`, async ({ homePage }) => {
        const card = homePage.productCard(title);
        await card.scrollIntoViewIfNeeded();
        await card.hover();
        await expect(homePage.wishlistButton(card)).toBeVisible();
        await expect(homePage.cartButton(card)).toBeVisible();
        await expect(homePage.quickViewButton(card)).toBeVisible();
      });
    }
  });

  test.describe('Product labels', () => {
    for (const title of SOLD_OUT_PRODUCTS) {
      test(`"${title}" is marked "${SOLD_OUT_LABEL}"`, async ({ homePage }) => {
        const card = homePage.productCard(title);
        await card.scrollIntoViewIfNeeded();
        await expect(homePage.soldOutLabel(card)).toBeVisible();
        await expect(homePage.soldOutLabel(card)).toHaveText(SOLD_OUT_LABEL);
      });
    }

    test(`only sold out products have a label and all labels say "${SOLD_OUT_LABEL}"`, async ({ homePage }) => {
      const labels = homePage.allProductLabels();
      await expect(labels).toHaveCount(SOLD_OUT_PRODUCTS.length);
      for (const label of await labels.all()) {
        await expect(label).toHaveText(SOLD_OUT_LABEL);
      }
    });
  });

  test.describe('Recipes section', () => {
    test('shows all recipe posts', async ({ homePage }) => {
      await expect(homePage.recipesSection).toBeVisible();
      for (const recipe of RECIPES) {
        await expect(homePage.recipeTitleLink(recipe.title)).toHaveAttribute('href', `${BASE}/${recipe.slug}/`);
      }
    });

    for (const recipe of RECIPES) {
      test(`recipe "${recipe.title}" opens its post page`, async ({ homePage, page }) => {
        await homePage.openRecipe(recipe.title);
        await expect(page).toHaveURL(`${BASE}/${recipe.slug}/`, { timeout: 60_000 });
        await expect(page).toHaveTitle(`${recipe.title} | BB Factory`);
        await expect(page.getByRole('heading', { level: 1, name: recipe.title })).toBeVisible();
      });

      test(`recipe "${recipe.title}" has correct share links`, async ({ homePage }) => {
        const url = `${BASE}/${recipe.slug}/`;
        const share = shareLinks(url);
        const links = {
          facebook: share.facebook,
          twitter: share.x,
          linkedin: share.linkedin,
        } as const;
        for (const [network, href] of Object.entries(links)) {
          const link = homePage.recipeShareLink(recipe.title, network as keyof typeof links);
          await expect(link).toHaveAttribute('href', href);
          await expect(link).toHaveAttribute('target', '_blank');
        }
      });
    }
  });

  test.describe('Reviews section', () => {
    test('shows section heading', async ({ homePage }) => {
      await homePage.scrollTo(homePage.reviewsSection);
      await expect(homePage.reviewsSection).toContainText(REVIEWS.subtitle);
      await expect(homePage.reviewsSection.getByRole('heading', { name: REVIEWS.heading })).toBeVisible();
    });

    test('contains all customer reviews with authors', async ({ homePage }) => {
      const slides = homePage.reviewSlides;
      await expect(slides).toHaveCount(REVIEWS.items.length);
      for (const [i, review] of REVIEWS.items.entries()) {
        await expect(slides.nth(i)).toContainText(review.text);
        await expect(slides.nth(i).locator('b')).toHaveText(review.author);
      }
    });
  });

  test.describe('Instagram section', () => {
    test('shows heading and all posts', async ({ homePage }) => {
      await homePage.scrollTo(homePage.instagramSection);
      await expect(homePage.instagramSection.getByRole('heading', { name: INSTAGRAM.heading })).toBeVisible();
      await expect(homePage.instagramPosts).toHaveCount(INSTAGRAM.reels.length);
    });

    for (const [i, reel] of INSTAGRAM.reels.entries()) {
      test(`instagram post ${i + 1} (${reel}) opens the correct Instagram page`, async ({ homePage, page }) => {
        await homePage.scrollTo(homePage.instagramSection);
        const post = homePage.instagramPosts.nth(i);
        await expect(post).toHaveAttribute('href', `https://www.instagram.com/reel/${reel}/`);
        const popupPromise = page.waitForEvent('popup');
        await post.click();
        const popup = await popupPromise;
        await expect(popup).toHaveURL(new RegExp(`instagram\\.com/.*${reel}`), { timeout: 60_000 });
      });
    }
  });

  test.describe('Footer', () => {
    test.beforeEach(async ({ homePage }) => {
      await homePage.footer.root.scrollIntoViewIfNeeded();
    });

    test('logo links to the site', async ({ homePage }) => {
      await expect(homePage.footer.logoLink).toHaveAttribute('href', FOOTER.logoHref);
    });

    test('shows address and working hours', async ({ homePage }) => {
      await expect(homePage.footer.root).toContainText(FOOTER.address);
      await expect(homePage.footer.root).toContainText(FOOTER.workingHours);
    });

    test('phone link is a correct tel link', async ({ homePage }) => {
      await expect(homePage.footer.phoneLink).toHaveText(FOOTER.phoneText);
      await expect(homePage.footer.phoneLink).toHaveAttribute('href', FOOTER.phoneHref);
    });

    test('footer and header phone numbers are the same number', async ({ homePage }) => {
      const digits = (s: string | null) => decodeURIComponent(s ?? '').replace(/\D/g, '');
      const header = await homePage.header.phoneLink.getAttribute('href');
      const footer = await homePage.footer.phoneLink.getAttribute('href');
      expect(digits(footer)).toBe(digits(header));
    });

    test('email link is a correct mailto link', async ({ homePage }) => {
      await expect(homePage.footer.emailLink).toHaveText(FOOTER.email);
      await expect(homePage.footer.emailLink).toHaveAttribute('href', FOOTER.emailHref);
    });

    test('social links point to the company Facebook and Instagram', async ({ homePage }) => {
      await expect(homePage.footer.facebookLink).toHaveAttribute('href', FOOTER.facebookHref);
      await expect(homePage.footer.facebookLink).toHaveAttribute('target', '_blank');
      await expect(homePage.footer.instagramLink).toHaveAttribute('href', FOOTER.instagramHref);
      await expect(homePage.footer.instagramLink).toHaveAttribute('target', '_blank');
    });

    test('developer link opens in a new tab and points to WD Market', async ({ homePage }) => {
      await expect(homePage.footer.developerLink).toHaveAttribute('href', FOOTER.developer.href);
      await expect(homePage.footer.developerLink).toHaveAttribute('target', '_blank');
    });

    test('footer column headings are shown', async ({ homePage }) => {
      for (const name of ['Navigācija', 'Kategorijas', 'Noderīgas saites', 'Darba laiks']) {
        await expect(homePage.footer.heading(name)).toBeVisible();
      }
    });

    const internalLinks = [
      ...FOOTER.navigation.map((l) => ({ group: 'navigation', ...l })),
      ...FOOTER.categories.map((l) => ({ group: 'category', ...l })),
      ...FOOTER.usefulLinks.map((l) => ({ group: 'useful', ...l })),
    ];

    for (const item of internalLinks) {
      test(`footer ${item.group} link "${item.name}" opens the correct page`, async ({ homePage, page }) => {
        const link = homePage.footer.link(item.name);
        await expect(link).toHaveAttribute('href', `${BASE}${item.path}`);
        await link.click({ noWaitAfter: true });
        await expect(page).toHaveURL(`${BASE}${item.path}`, { timeout: 60_000 });
        await expect(page).toHaveTitle(item.title);
      });
    }
  });
});
