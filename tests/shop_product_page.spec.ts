import { test, expect } from '../src/fixtures';
import { BASE } from '../src/data/homepage.data';
import { CART, PRICE_FILTER, PRODUCT_PAGE, PRODUCTS_TO_CHECK, SHOP, SORTING } from '../src/data/shop.data';

/**
 * Known site problem: /wp-admin/admin-ajax.php answers 404 intermittently on https://bbfactory.lv/.
 * The quick view popup and the ajax "Pievienot grozam" on the product page depend on it, so these tests
 * are tagged @flaky and carry an annotation with the reason. They are never skipped.
 */
const AJAX_FLAKY = {
  type: 'flaky',
  description: 'admin-ajax.php (quick view / ajax add to cart) intermittently responds 404 on the site',
};

test.describe('Shop page', () => {
  test.beforeEach(async ({ homePage, shopPage, page }) => {
    await homePage.openWithCookiesAccepted();
    await homePage.header.openMenu(SHOP.menuName);
    await expect(page).toHaveURL(`${BASE}${SHOP.path}`, { timeout: 60_000 });
  });

  test('opens with correct title and heading', async ({ shopPage, page }) => {
    await expect(page).toHaveTitle(SHOP.title);
    await expect(shopPage.heading).toHaveText(SHOP.heading);
    await expect(shopPage.productCards.first()).toBeVisible();
  });

  test('shows the price filter and the sorting select', async ({ shopPage }) => {
    await expect(shopPage.priceFilterHeading).toBeVisible();
    await expect(shopPage.maxPriceInput).toBeVisible();
    await expect(shopPage.sortSelect).toBeVisible();
    await expect(shopPage.sortSelect.locator('option', { hasText: SORTING.label })).toHaveCount(1);
  });

  test.describe('filtered by max price and sorted by price (high to low)', () => {
    test.beforeEach(async ({ shopPage }) => {
      await shopPage.setMaxPrice(PRICE_FILTER.maxPrice, PRICE_FILTER.urlParam);
      await shopPage.sortBy(SORTING.label, SORTING.urlParam);
    });

    test('filter and sorting are applied', async ({ shopPage, page }) => {
      await expect(page).toHaveURL(PRICE_FILTER.urlParam, { timeout: 60_000 });
      await expect(page).toHaveURL(SORTING.urlParam, { timeout: 60_000 });
      await expect(shopPage.maxPriceInput).toHaveValue(`€${PRICE_FILTER.maxPrice}`);
      await expect(shopPage.sortSelect).toHaveValue(SORTING.value);
    });

    test(`first ${PRODUCTS_TO_CHECK} products cost at most ${PRICE_FILTER.maxPrice} EUR or their price range includes it`, async ({
      shopPage,
    }) => {
      await expect(shopPage.productCards.nth(PRODUCTS_TO_CHECK - 1)).toBeVisible();
      for (let i = 0; i < PRODUCTS_TO_CHECK; i++) {
        const card = shopPage.card(i);
        const title = await card.titleText();
        const { min, max } = await card.priceRange();
        const ok = max <= PRICE_FILTER.maxPrice || (min <= PRICE_FILTER.maxPrice && PRICE_FILTER.maxPrice <= max);
        expect(ok, `"${title}" costs ${min}-${max} EUR`).toBe(true);
      }
    });

    test(
      'quick view of the first product shows its title, price, quantity selector and add to cart button',
      { tag: '@flaky', annotation: AJAX_FLAKY },
      async ({ shopPage }) => {
        const card = shopPage.card(0);
        const title = await card.titleText();
        const price = await card.priceRange();

        await shopPage.openQuickView(card);
        await expect(shopPage.quickView.title).toHaveText(title);
        expect(await shopPage.quickView.priceRange()).toEqual(price);
        await expect(shopPage.quickView.quantityInput).toBeVisible();
        await expect(shopPage.quickView.addToCartButton).toBeVisible();
      },
    );

    test(
      'quick view: selected option and increased quantity are added to the side cart',
      { tag: '@flaky', annotation: AJAX_FLAKY },
      async ({ shopPage }) => {
        const card = shopPage.card(0);
        const title = await card.titleText();
        await shopPage.openQuickView(card);
        await expect(shopPage.quickView.root).toBeVisible();

        const optionLabels = await shopPage.quickView.optionSelect
          .locator('option[value]:not([value=""])')
          .allTextContents();
        const option = optionLabels[0].trim();
        await shopPage.quickView.optionSelect.selectOption({ label: option });
        await shopPage.quickView.increaseButton.click();
        await expect(shopPage.quickView.quantityInput).toHaveValue('2');
        await shopPage.quickView.addToCartButton.click();

        const item = shopPage.miniCart.item(title);
        await expect(item).toBeVisible();
        await expect(shopPage.miniCart.itemQuantityAndPrice(item)).toContainText(`2 ${CART.quantityMultiplier}`);
        await expect(item).toContainText(option);
      },
    );

    test('quick view can be closed', { tag: '@flaky', annotation: AJAX_FLAKY }, async ({ shopPage }) => {
      await shopPage.openQuickView(shopPage.card(0));
      await expect(shopPage.quickView.root).toBeVisible();
      await shopPage.quickView.close();
      await expect(shopPage.quickView.root).toBeHidden();
    });

    test.describe('second product page', () => {
      let title: string;
      let price: { min: number; max: number };

      test.beforeEach(async ({ shopPage, page }) => {
        const card = shopPage.card(1);
        title = await card.titleText();
        price = await card.priceRange();
        await shopPage.openProduct(card);
        await expect(page).toHaveURL(PRODUCT_PAGE.urlPattern, { timeout: 60_000 });
      });

      test('title and price match the selected product', async ({ productPage, page }) => {
        await expect(page).toHaveTitle(new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
        await expect(productPage.heading).toHaveText(title);
        expect(await productPage.priceRange()).toEqual(price);
      });

      test('shows product image, quantity selector and add to cart button', async ({ productPage }) => {
        await expect(productPage.image).toBeVisible();
        await expect
          .poll(() => productPage.image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
          .toBe(true);
        await expect(productPage.quantityInput).toBeVisible();
        await expect(productPage.addToCartButton).toBeVisible();
        await expect(productPage.addToCartButton).toHaveText(PRODUCT_PAGE.addToCart);
      });

      test('shows the description section', async ({ productPage }) => {
        await expect(productPage.descriptionTab).toBeVisible();
        await expect(productPage.descriptionPanel).toBeVisible();
        await expect(productPage.descriptionPanel).not.toBeEmpty();
      });

      test(
        'shows the related products section with working scroll arrows',
        {
          tag: '@flaky',
          annotation: {
            type: 'flaky',
            description: 'the carousel scripts intermittently do not initialise, then the arrows do nothing',
          },
        },
        async ({ productPage }) => {
          await productPage.scrollRelatedToCenter();
          await expect(productPage.relatedHeading).toBeVisible();
          await expect(productPage.relatedCards.first()).toBeVisible();

          // start position: cannot scroll back
          await expect(productPage.relatedPrev).toHaveClass(/wd-disabled/);
          await expect(productPage.relatedNext).not.toHaveClass(/wd-disabled/);
          const start = await productPage.relatedOffset();

          await productPage.relatedCards.nth(1).hover();
          await productPage.relatedNext.click();
          await expect.poll(() => productPage.relatedOffset()).toBeLessThan(start);
          await expect(productPage.relatedPrev).not.toHaveClass(/wd-disabled/);

          await productPage.relatedCards.nth(1).hover();
          await productPage.relatedPrev.click();
          await expect.poll(() => productPage.relatedOffset()).toBe(start);
          await expect(productPage.relatedPrev).toHaveClass(/wd-disabled/);
        },
      );

      test('related products have add to cart, wishlist and quick view buttons', async ({ productPage }) => {
        await productPage.related.scrollIntoViewIfNeeded();
        const count = await productPage.relatedCards.count();
        expect(count).toBeGreaterThan(0);
        for (let i = 0; i < count; i++) {
          const card = productPage.relatedCard(i);
          await expect(card.cartButton).toHaveCount(1);
          await expect(card.wishlistButton).toHaveCount(1);
          await expect(card.quickViewButton).toHaveCount(1);
        }
        // the cards currently shown in the carousel display the three buttons on hover
        const first = productPage.relatedCard(0);
        await first.hover();
        await expect(first.cartButton).toBeVisible();
        await expect(first.wishlistButton).toBeVisible();
        await expect(first.quickViewButton).toBeVisible();
        await expect(first.wishlistButton).toHaveText(PRODUCT_PAGE.cardButtons[1]);
        await expect(first.quickViewButton).toHaveText(PRODUCT_PAGE.cardButtons[2]);
      });

      test('shows the Instagram section', async ({ productPage }) => {
        await productPage.instagramHeading.scrollIntoViewIfNeeded();
        await expect(productPage.instagramHeading).toBeVisible();
        await expect(productPage.instagramPosts.first()).toBeVisible();
      });

      test(
        'selected option and increased quantity are added to the side cart',
        { tag: '@flaky', annotation: AJAX_FLAKY },
        async ({ productPage }) => {
            const option = await productPage.selectFirstOption();
          await expect(productPage.stock).toContainText('Noliktavā');
          const stock = await productPage.stockQuantity();
          const quantity = stock >= 2 ? await productPage.increaseQuantity() : 1;
          expect(quantity).toBe(stock >= 2 ? 2 : 1);

          await productPage.addToCartButton.click();

          const item = productPage.miniCart.item(title);
          await expect(item).toBeVisible();
          await expect(productPage.miniCart.itemQuantityAndPrice(item)).toContainText(
            `${quantity} ${CART.quantityMultiplier}`,
          );
          await expect(item).toContainText(option);
        },
      );
    });
  });
});
