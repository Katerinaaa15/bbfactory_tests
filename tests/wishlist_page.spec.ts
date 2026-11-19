import { test, expect } from '../src/fixtures';
import { BASE } from '../src/data/homepage.data';
import { SHOP } from '../src/data/shop.data';
import { WISHLIST } from '../src/data/wishlist.data';
import { type ProductCard } from '../src/components/ProductCard';

/**
 * Known site problem: removing the LAST product from the wishlist calls /wp-admin/admin-ajax.php, which
 * answers 404 on https://bbfactory.lv/, so the wishlist never becomes empty. The test is written correctly
 * and tagged @flaky with an annotation. It is never skipped.
 */
const AJAX_FLAKY = {
  type: 'flaky',
  description: 'removing the last wishlist product calls admin-ajax.php, which responds 404 on the site',
};

test.describe('Wishlist', () => {
  // the site is slow and these flows contain several page loads
  test.describe.configure({ timeout: 240_000 });

  test.beforeEach(async ({ homePage, page }) => {
    await homePage.openWithCookiesAccepted();
    await homePage.header.openMenu(SHOP.menuName);
    await expect(page).toHaveURL(`${BASE}${SHOP.path}`, { timeout: 60_000 });
    await expect(page).toHaveTitle(SHOP.title);
  });

  test('heart icons of the first 3 products add them to the wishlist', async ({ shopPage, page }) => {
    for (let i = 0; i < WISHLIST.productsToAdd; i++) {
      const card = shopPage.card(i);
      await card.hover();
      await expect(card.wishlistButton).toHaveText(WISHLIST.addText);
      await card.activate(card.wishlistButton);
    }
    // on hover the added products offer to remove them
    await page.mouse.move(5, 5);
    for (let i = 0; i < WISHLIST.productsToAdd; i++) {
      const card = shopPage.card(i);
      await card.hover();
      await expect(card.wishlistButton).toHaveText(WISHLIST.removeText);
    }
  });

  test.describe('with 3 products in the wishlist', () => {
    let titles: string[];

    test.beforeEach(async ({ shopPage }) => {
      titles = [];
      for (let i = 0; i < WISHLIST.productsToAdd; i++) {
        const card: ProductCard = shopPage.card(i);
        titles.push(await card.titleText());
        await card.hover();
        await card.activate(card.wishlistButton);
        await expect(card.wishlistButton).toHaveText(WISHLIST.removeText);
      }
    });

    test('product page shows and toggles the wishlist state', async ({ shopPage, productPage, page }) => {
      await shopPage.openProduct(shopPage.card(0));
      await expect(page).toHaveURL(/\/produkts\//, { timeout: 60_000 });
      await productPage.waitForScripts();
      await expect(productPage.heading).toHaveText(titles[0]);

      // already added: offers to remove
      await expect(productPage.wishlistButton).toHaveText(WISHLIST.removeText);
      await productPage.wishlistButton.click();
      await expect(productPage.wishlistButton).toHaveText(WISHLIST.addText);
      // add again
      await productPage.wishlistButton.click();
      await expect(productPage.wishlistButton).toHaveText(WISHLIST.removeText);
    });

    test('wishlist page opens with correct title and shows all added products', async ({
      shopPage,
      wishlistPage,
      page,
    }) => {
      await shopPage.header.iconLink(WISHLIST.path).click({ noWaitAfter: true });
      await expect(page).toHaveURL(`${BASE}${WISHLIST.path}`, { timeout: 60_000 });
      await expect(page).toHaveTitle(WISHLIST.title);
      await expect(wishlistPage.heading).toHaveText(WISHLIST.heading);

      await expect(wishlistPage.cards).toHaveCount(titles.length);
      for (const title of titles) {
        const card = wishlistPage.card(title);
        await expect(card.root).toBeVisible();
        await expect(wishlistPage.removeButton(card.root)).toHaveText(WISHLIST.removeCardText);
      }
    });

    test.describe('wishlist page', () => {
      test.beforeEach(async ({ shopPage, wishlistPage, page }) => {
        await shopPage.header.iconLink(WISHLIST.path).click({ noWaitAfter: true });
        await expect(page).toHaveURL(`${BASE}${WISHLIST.path}`, { timeout: 60_000 });
        await wishlistPage.waitForScripts();
        await expect(wishlistPage.cards).toHaveCount(titles.length);
      });

      test('products can be removed one by one', async ({ wishlistPage }) => {
        for (const title of titles.slice(0, -1)) {
          const before = await wishlistPage.cards.count();
          await wishlistPage.removeButton(wishlistPage.card(title).root).click();
          await expect(wishlistPage.cards).toHaveCount(before - 1);
          await expect(wishlistPage.card(title).root).toHaveCount(0);
        }
        expect(await wishlistPage.titles()).toEqual([titles[titles.length - 1]]);
      });

      test(
        'removing every product shows the empty wishlist message',
        { tag: '@flaky', annotation: AJAX_FLAKY },
        async ({ wishlistPage, page }) => {
          for (const title of titles) {
            await wishlistPage.removeButton(wishlistPage.card(title).root).click();
            await expect(wishlistPage.card(title).root).toHaveCount(0, { timeout: 45_000 });
          }
          await expect(wishlistPage.cards).toHaveCount(0);

          await expect(wishlistPage.emptyTitle).toHaveText(WISHLIST.empty.title);
          await expect(wishlistPage.emptyText).toContainText(WISHLIST.empty.text);
          await expect(wishlistPage.emptyText).toContainText(WISHLIST.empty.shopHint);
          await expect(wishlistPage.returnToShopButton).toHaveText(WISHLIST.empty.button);
          await expect(wishlistPage.returnToShopButton).toHaveAttribute('href', `${BASE}${WISHLIST.empty.buttonHref}`);
          await wishlistPage.returnToShopButton.click({ noWaitAfter: true });
          await expect(page).toHaveURL(`${BASE}${SHOP.path}`, { timeout: 60_000 });
        },
      );
    });
  });

  test('an empty wishlist shows the empty message and a button back to the shop', async ({
    shopPage,
    wishlistPage,
    page,
  }) => {
    await shopPage.header.iconLink(WISHLIST.path).click({ noWaitAfter: true });
    await expect(page).toHaveURL(`${BASE}${WISHLIST.path}`, { timeout: 60_000 });
    await expect(page).toHaveTitle(WISHLIST.title);

    await expect(wishlistPage.cards).toHaveCount(0);
    await expect(wishlistPage.emptyTitle).toHaveText(WISHLIST.empty.title);
    await expect(wishlistPage.emptyText).toContainText(WISHLIST.empty.text);
    await expect(wishlistPage.emptyText).toContainText(WISHLIST.empty.shopHint);
    await expect(wishlistPage.returnToShopButton).toHaveText(WISHLIST.empty.button);

    await wishlistPage.returnToShopButton.click({ noWaitAfter: true });
    await expect(page).toHaveURL(`${BASE}${SHOP.path}`, { timeout: 60_000 });
    await expect(page).toHaveTitle(SHOP.title);
  });
});
