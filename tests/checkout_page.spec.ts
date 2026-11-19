import { test, expect } from '../src/fixtures';
import { BASE } from '../src/data/homepage.data';
import { SHOP } from '../src/data/shop.data';
import { CART_PAGE } from '../src/data/cart.data';
import {
  CHECKOUT,
  COUPON_FORM,
  CUSTOMER,
  FIELD_LABELS,
  HEADINGS,
  LOGIN,
  NO_PAYMENT_METHOD_MESSAGE,
  ORDER_TABLE,
  PAYMENT,
  PLACEHOLDERS,
  REQUIRED_ERRORS,
} from '../src/data/checkout.data';

interface AddedProduct {
  title: string;
  price: number;
}

test.describe('Checkout page', () => {
  // the site is slow and these flows contain several page loads
  test.describe.configure({ timeout: 240_000 });

  let products: AddedProduct[];

  test.beforeEach(async ({ homePage, shopPage, cartPage, checkoutPage, page }) => {
    await homePage.openWithCookiesAccepted();
    await homePage.header.openMenu(SHOP.menuName);
    await expect(page).toHaveURL(`${BASE}${SHOP.path}`, { timeout: 60_000 });
    await expect(page).toHaveTitle(SHOP.title);

    // add the first and the second product; the side cart shows them correctly
    products = [];
    for (const index of [0, 1]) {
      const card = shopPage.card(index);
      products.push({ title: await card.titleText(), price: (await card.priceRange()).min });
      await shopPage.addToCart(card);
      for (const product of products) {
        const item = shopPage.miniCart.item(product.title);
        await expect(shopPage.miniCart.itemTitle(item)).toHaveText(product.title);
        await expect(shopPage.miniCart.itemQuantityAndPrice(item)).toContainText('1 ×');
        expect(await shopPage.miniCart.itemUnitPrice(item)).toBeCloseTo(product.price, 2);
      }
      if (index === 0) {
        await shopPage.miniCart.closeButton.click();
        await expect(shopPage.miniCart.root).toBeHidden();
      }
    }

    // cart page, then checkout
    await cartPage.miniCart.viewCartButton.click({ noWaitAfter: true });
    await expect(page).toHaveURL(`${BASE}${CART_PAGE.path}`, { timeout: 60_000 });
    await expect(page).toHaveTitle(CART_PAGE.title);
    await cartPage.checkoutButton.click({ noWaitAfter: true });
    await expect(page).toHaveURL(`${BASE}${CHECKOUT.path}`, { timeout: 60_000 });
    await expect(page).toHaveTitle(CHECKOUT.title);
  });

  test('opens with correct title and shows the ordered products', async ({ checkoutPage, page }) => {
    await expect(page).toHaveTitle(CHECKOUT.title);
    for (const product of products) {
      await expect(checkoutPage.orderReview.locator('tr.cart_item', { hasText: product.title })).toContainText('× 1');
    }
  });

  test('login form can be opened and closed', async ({ checkoutPage }) => {
    await expect(checkoutPage.loginToggle).toBeVisible();
    await expect(checkoutPage.loginForm).toBeHidden();

    await checkoutPage.setToggle(checkoutPage.loginToggle, checkoutPage.loginForm, true);
    for (const label of LOGIN.labels) {
      await expect(checkoutPage.loginForm.locator('label', { hasText: label })).toBeVisible();
    }
    await expect(checkoutPage.loginForm.getByRole('button', { name: LOGIN.submit })).toBeVisible();

    await checkoutPage.setToggle(checkoutPage.loginToggle, checkoutPage.loginForm, false);
    await expect(checkoutPage.loginForm).toBeHidden();
  });

  test('coupon form validates the coupon code', async ({ checkoutPage }) => {
    await expect(checkoutPage.couponToggle).toBeVisible();
    await expect(checkoutPage.couponForm).toBeHidden();

    await checkoutPage.setToggle(checkoutPage.couponToggle, checkoutPage.couponForm, true);
    await expect(checkoutPage.couponInput).toHaveAttribute('placeholder', COUPON_FORM.placeholder);

    // empty field
    await checkoutPage.applyCoupon('');
    await expect(checkoutPage.couponNotice).toHaveText(COUPON_FORM.emptyMessage);

    // unknown coupon
    await checkoutPage.applyCoupon(COUPON_FORM.invalidCode);
    await expect(checkoutPage.couponNotice).toHaveText(COUPON_FORM.invalidMessage);

    await checkoutPage.setToggle(checkoutPage.couponToggle, checkoutPage.couponForm, false);
    await expect(checkoutPage.couponForm).toBeHidden();
  });

  test.describe('texts in Latvian', () => {
    test('section and shipment titles are displayed correctly', async ({ checkoutPage }) => {
      await expect(checkoutPage.form.getByRole('heading', { name: HEADINGS.billing })).toBeVisible();
      await expect(checkoutPage.form.getByRole('heading', { name: HEADINGS.additional })).toBeVisible();
      await expect(checkoutPage.form.getByRole('heading', { name: HEADINGS.order })).toBeVisible();
      await expect(checkoutPage.page.getByText(LOGIN.question)).toBeVisible();
      await expect(checkoutPage.page.getByText(COUPON_FORM.question)).toBeVisible();

      for (const column of ORDER_TABLE.columns) {
        await expect(checkoutPage.orderReview.getByRole('columnheader', { name: column })).toBeVisible();
      }
      for (const row of ORDER_TABLE.rows) {
        await expect(checkoutPage.orderReview.getByRole('rowheader', { name: row, exact: true })).toBeVisible();
      }
      await expect(checkoutPage.orderReview.locator('tr.shipping')).toContainText(ORDER_TABLE.shippingLabel);
      await expect(checkoutPage.form.getByText(FIELD_LABELS.shipToDifferent)).toBeVisible();
      await expect(checkoutPage.form.getByText(FIELD_LABELS.createAccount)).toBeVisible();
    });

    test('input field labels are displayed correctly', async ({ checkoutPage }) => {
      const labels: Record<string, string> = {
        billing_is_compnay: FIELD_LABELS.person,
        billing_first_name: FIELD_LABELS.firstName,
        billing_last_name: FIELD_LABELS.lastName,
        billing_country: FIELD_LABELS.country,
        billing_address_1: FIELD_LABELS.street,
        billing_city: FIELD_LABELS.city,
        billing_state: FIELD_LABELS.state,
        billing_postcode: FIELD_LABELS.postcode,
        billing_phone: FIELD_LABELS.phone,
        billing_email: FIELD_LABELS.email,
        order_comments: FIELD_LABELS.notes,
      };
      for (const [name, text] of Object.entries(labels)) {
        await expect(checkoutPage.label(name), `label of ${name}`).toContainText(text);
      }
      await expect(checkoutPage.field('billing_is_compnay')).toContainText(FIELD_LABELS.individual);
      await expect(checkoutPage.field('billing_is_compnay')).toContainText(FIELD_LABELS.legalEntity);
      await expect(checkoutPage.input('billing_address_1')).toHaveAttribute('placeholder', PLACEHOLDERS.street);
      await expect(checkoutPage.input('billing_address_2')).toHaveAttribute('placeholder', PLACEHOLDERS.street2);
      await expect(checkoutPage.input('order_comments')).toHaveAttribute('placeholder', PLACEHOLDERS.notes);
    });

    test('payment methods, terms and order button are displayed correctly', async ({ checkoutPage }) => {
      for (const method of PAYMENT.methods) {
        await expect(checkoutPage.paymentMethod(method)).toBeVisible();
      }
      await expect(checkoutPage.termsLabel).toContainText(FIELD_LABELS.terms);
      await expect(checkoutPage.placeOrderButton).toHaveText(PAYMENT.placeOrder);
    });
  });

  test('empty form shows validation messages in Latvian', async ({ checkoutPage }) => {
    await checkoutPage.placeOrderExpectingErrors();

    await expect(checkoutPage.errors).toHaveText(REQUIRED_ERRORS.list);
    for (const [fieldId, message] of Object.entries(REQUIRED_ERRORS.inline)) {
      await expect(checkoutPage.pageField(fieldId), fieldId).toContainText(message);
    }
    await expect(checkoutPage.form.locator('.woocommerce-terms-and-conditions-wrapper')).toContainText(
      REQUIRED_ERRORS.list[REQUIRED_ERRORS.list.length - 1],
    );
  });

  test('filled form without a chosen bank shows "Nav izvēlēta maksājuma metode!"', async ({ checkoutPage, page }) => {
    await checkoutPage.fill('billing_first_name', CUSTOMER.firstName);
    await checkoutPage.fill('billing_last_name', CUSTOMER.lastName);
    await checkoutPage.chooseCountry(CUSTOMER.country);
    await checkoutPage.fill('billing_address_1', CUSTOMER.street);
    await checkoutPage.fill('billing_city', CUSTOMER.city);
    await checkoutPage.fill('billing_state', CUSTOMER.state);
    await checkoutPage.fill('billing_postcode', CUSTOMER.postcode);
    await checkoutPage.fill('billing_phone', CUSTOMER.phone);
    await checkoutPage.fill('billing_email', CUSTOMER.email);
    await checkoutPage.fill('order_comments', CUSTOMER.notes);
    await checkoutPage.waitForOrderReview();

    // Omniva parcel terminal
    const terminal = await checkoutPage.selectAnotherTerminal();
    await expect(checkoutPage.terminalDropdown).toContainText(terminal);

    // payment method "Internetabanka" without choosing a bank
    await checkoutPage.paymentMethod(PAYMENT.bank).click();
    await expect(page.locator('#payment_method_everypay_bank')).toBeChecked();

    await checkoutPage.termsLabel.locator('#terms').check();
    await expect(checkoutPage.terms).toBeChecked();

    await checkoutPage.placeOrderExpectingErrors();
    await expect(checkoutPage.errors).toHaveText([NO_PAYMENT_METHOD_MESSAGE]);
    // no order is created: the customer stays on the checkout page
    await expect(page).toHaveURL(`${BASE}${CHECKOUT.path}`, { timeout: 60_000 });
  });
});
