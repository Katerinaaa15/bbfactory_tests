import { test, expect } from '../src/fixtures';
import { BASE } from '../src/data/homepage.data';
import { SHOP } from '../src/data/shop.data';
import {
  CART_MESSAGES,
  CART_PAGE,
  CART_TEXTS,
  COUPON,
  MONEY_TOLERANCE,
  SHIPPING_ADDRESS,
  VAT_RATE,
} from '../src/data/cart.data';

interface AddedProduct {
  title: string;
  price: number;
}

test.describe('Shopping cart', () => {
  // the site is slow and these flows contain several page loads
  test.describe.configure({ timeout: 240_000 });

  test.beforeEach(async ({ homePage, page }) => {
    await homePage.openWithCookiesAccepted();
    await homePage.header.openMenu(SHOP.menuName);
    await expect(page).toHaveURL(`${BASE}${SHOP.path}`, { timeout: 60_000 });
  });

  test('shop page opens with correct title', async ({ shopPage, page }) => {
    await expect(page).toHaveTitle(SHOP.title);
    await expect(shopPage.heading).toHaveText(SHOP.heading);
    await expect(shopPage.productCards.first()).toBeVisible();
  });

  test('side cart shows the first added product correctly', async ({ shopPage }) => {
    const card = shopPage.card(0);
    const title = await card.titleText();
    const price = (await card.priceRange()).min;

    await shopPage.addToCart(card);

    await expect(shopPage.miniCart.root.getByText(CART_PAGE.sideCartHeading)).toBeVisible();
    await expect(shopPage.miniCart.items).toHaveCount(1);
    const item = shopPage.miniCart.item(title);
    await expect(shopPage.miniCart.itemTitle(item)).toHaveText(title);
    await expect(shopPage.miniCart.itemQuantityAndPrice(item)).toContainText('1 ×');
    expect(await shopPage.miniCart.itemUnitPrice(item)).toBeCloseTo(price, 2);
    await expect(shopPage.miniCart.viewCartButton).toBeVisible();
    await expect(shopPage.miniCart.checkoutButton).toBeVisible();
  });

  test('side cart shows both added products correctly', async ({ shopPage }) => {
    const added: AddedProduct[] = [];
    for (const index of [0, 1]) {
      const card = shopPage.card(index);
      added.push({ title: await card.titleText(), price: (await card.priceRange()).min });
      await shopPage.addToCart(card);
      if (index === 0) {
        await shopPage.miniCart.closeButton.click();
        await expect(shopPage.miniCart.root).toBeHidden();
      }
    }

    await expect(shopPage.miniCart.items).toHaveCount(2);
    for (const product of added) {
      const item = shopPage.miniCart.item(product.title);
      await expect(shopPage.miniCart.itemTitle(item)).toHaveText(product.title);
      await expect(shopPage.miniCart.itemQuantityAndPrice(item)).toContainText('1 ×');
      expect(await shopPage.miniCart.itemUnitPrice(item)).toBeCloseTo(product.price, 2);
    }
  });

  test.describe('cart page', () => {
    let products: AddedProduct[];

    test.beforeEach(async ({ shopPage, cartPage, page }) => {
      products = [];
      for (const index of [0, 1]) {
        const card = shopPage.card(index);
        products.push({ title: await card.titleText(), price: (await card.priceRange()).min });
        await shopPage.addToCart(card);
        if (index === 0) {
          await shopPage.miniCart.closeButton.click();
          await expect(shopPage.miniCart.root).toBeHidden();
        }
      }
      await cartPage.miniCart.viewCartButton.click({ noWaitAfter: true });
      await expect(page).toHaveURL(`${BASE}${CART_PAGE.path}`, { timeout: 60_000 });
    });

    test('opens with correct title and shows the added products', async ({ cartPage, page }) => {
      await expect(page).toHaveTitle(CART_PAGE.title);
      await expect(cartPage.rows).toHaveCount(products.length);
      for (const product of products) {
        const row = cartPage.row(product.title);
        await expect(row).toBeVisible();
        await expect(row.locator('.product-name a')).toHaveText(product.title);
        expect(await cartPage.amount(cartPage.rowPrice(row))).toBeCloseTo(product.price, 2);
        await expect(cartPage.rowQuantity(row)).toHaveValue('1');
        // line totals are shown without VAT
        expect(await cartPage.amount(cartPage.rowSubtotal(row))).toBeCloseTo(product.price / (1 + VAT_RATE), 1);
      }
    });

    test('section names are displayed in Latvian', async ({ cartPage }) => {
      for (const column of CART_TEXTS.tableColumns) {
        await expect(cartPage.rows.first().page().getByRole('columnheader', { name: column, exact: true })).toBeVisible();
      }
      await expect(cartPage.totalsHeading).toHaveText(CART_TEXTS.totalsHeading);
      for (const row of CART_TEXTS.totalsRows) {
        await expect(cartPage.totalsRow(row)).toBeVisible();
      }
      await expect(cartPage.couponInput).toHaveAttribute('placeholder', CART_TEXTS.couponPlaceholder);
      await expect(cartPage.couponButton).toHaveText(CART_TEXTS.couponButton);
      await expect(cartPage.updateButton).toHaveText(CART_TEXTS.updateButton);
      await expect(cartPage.checkoutButton).toHaveText(CART_TEXTS.checkoutButton);
      await expect(cartPage.shippingRow).toContainText(CART_TEXTS.shippingLabel);
    });

    test('changing the quantity updates product price and totals', async ({ cartPage }) => {
      const [first, second] = products;
      const secondRow = cartPage.row(second.title);
      const secondSubtotalBefore = await cartPage.amount(cartPage.rowSubtotal(secondRow));

      await cartPage.setQuantity(first.title, 2);

      await expect(cartPage.cartMessage).toHaveText(CART_MESSAGES.cartUpdated);
      const firstRow = cartPage.row(first.title);
      await expect(cartPage.rowQuantity(firstRow)).toHaveValue('2');
      // unit price unchanged, line total doubled (without VAT)
      expect(await cartPage.amount(cartPage.rowPrice(firstRow))).toBeCloseTo(first.price, 2);
      const firstSubtotal = await cartPage.amount(cartPage.rowSubtotal(firstRow));
      expect(Math.abs(firstSubtotal - (2 * first.price) / (1 + VAT_RATE))).toBeLessThanOrEqual(MONEY_TOLERANCE);
      // the other product is untouched
      expect(await cartPage.amount(cartPage.rowSubtotal(cartPage.row(second.title)))).toBeCloseTo(
        secondSubtotalBefore,
        2,
      );

      // totals: Summa = sum of line totals, Kopā = Summa + PVN + shipping
      const subtotal = await cartPage.amount(cartPage.totalsAmount('Summa'));
      const secondSubtotal = await cartPage.amount(cartPage.rowSubtotal(cartPage.row(second.title)));
      expect(Math.abs(subtotal - (firstSubtotal + secondSubtotal))).toBeLessThanOrEqual(MONEY_TOLERANCE);
      const vat = await cartPage.amount(cartPage.totalsAmount('PVN'));
      const shipping = await cartPage.amount(cartPage.shippingCost);
      const total = await cartPage.amount(cartPage.totalsAmount('Kopā'));
      expect(Math.abs(total - (subtotal + vat + shipping))).toBeLessThanOrEqual(MONEY_TOLERANCE);
      expect(Math.abs(vat - subtotal * VAT_RATE)).toBeLessThanOrEqual(MONEY_TOLERANCE * 2);
    });

    test('empty coupon shows "Lūdzu ievadiet kupona numuru."', async ({ cartPage }) => {
      await cartPage.applyCoupon('');
      await expect(cartPage.couponNotice).toHaveText(COUPON.emptyMessage);
    });

    test('unknown coupon shows that it does not exist', async ({ cartPage }) => {
      await cartPage.applyCoupon(COUPON.invalidCode);
      await expect(cartPage.couponNotice).toHaveText(COUPON.invalidMessage);
    });

    test('Omniva parcel terminal can be selected', async ({ cartPage }) => {
      await expect(cartPage.terminalSelect).toBeVisible();
      await expect(cartPage.terminalSelect.locator('option').first()).toHaveText(CART_TEXTS.terminalPlaceholder);
      expect(await cartPage.terminalSelect.locator('option').count()).toBeGreaterThan(1);
      const name = await cartPage.selectFirstTerminal();
      expect(name).not.toBe(CART_TEXTS.terminalPlaceholder);
      await expect(cartPage.terminalSelect).not.toHaveValue('');
    });

    test('shipping address form validates mandatory fields', async ({ cartPage }) => {
      await cartPage.openShippingForm();
      await expect(async () => {
        await cartPage.shippingUpdateButton.click();
        await expect(cartPage.cityError).toBeVisible({ timeout: 5_000 });
      }).toPass({ timeout: 60_000 });
      await expect(cartPage.cityError).toHaveText(SHIPPING_ADDRESS.required.city);
      await expect(cartPage.postcodeError).toHaveText(SHIPPING_ADDRESS.required.postcode);
    });

    test('shipping form labels are displayed in Latvian', async ({ cartPage }) => {
      await cartPage.openShippingForm();
      for (const label of CART_TEXTS.shippingFormLabels) {
        await expect(cartPage.shippingForm.locator('label', { hasText: label })).toBeVisible();
      }
      await expect(cartPage.shippingUpdateButton).toHaveText(CART_TEXTS.shippingUpdateButton);
    });

    test('shipping address can be updated', async ({ cartPage }) => {
      await cartPage.openShippingForm();
      await cartPage.chooseCountry(SHIPPING_ADDRESS.country);
      await cartPage.cityInput.fill(SHIPPING_ADDRESS.city);
      await cartPage.postcodeInput.fill(SHIPPING_ADDRESS.postcode);
      await cartPage.shippingUpdateButton.click();

      await expect(cartPage.cartMessage).toHaveText(CART_MESSAGES.shippingUpdated, { timeout: 45_000 });
      await expect(cartPage.shippingRow).toContainText(SHIPPING_ADDRESS.summary);
      await expect(cartPage.shippingRow.getByText(SHIPPING_ADDRESS.changeAddress)).toBeVisible();
    });
  });
});
