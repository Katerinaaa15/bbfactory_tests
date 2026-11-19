import { test, expect } from '../src/fixtures';
import { BASE } from '../src/data/homepage.data';
import { ADDRESSES, MY_ACCOUNT, ORDER_VIEW, ORDERS, PROFILE } from '../src/data/auth.data';

test.describe('My Account (authenticated user)', () => {
  // the site is slow and every test logs in first
  test.describe.configure({ timeout: 300_000 });

  test.beforeEach(async ({ homePage, myAccountPage, page }) => {
    await homePage.openWithCookiesAccepted();
    await homePage.openSideLogin();
    await expect(myAccountPage.sideLogin.root).toBeVisible();

    // credentials are read from .env
    await myAccountPage.loginFromSideWindow();

    // the "Mans konts" icon now leads to the account page
    await homePage.header.iconLink(MY_ACCOUNT.path).click({ noWaitAfter: true });
    await expect(page).toHaveURL(`${BASE}${MY_ACCOUNT.path}`, { timeout: 90_000 });
    await myAccountPage.waitForScripts();
  });

  test('account page opens with correct title and side menu', async ({ myAccountPage, page }) => {
    await expect(page).toHaveTitle(MY_ACCOUNT.title);
    await expect(myAccountPage.heading).toHaveText(MY_ACCOUNT.heading);
    for (const item of MY_ACCOUNT.menu) {
      await expect(myAccountPage.menuLink(item)).toBeVisible();
    }
  });

  test.describe('orders', () => {
    test.beforeEach(async ({ myAccountPage, page }) => {
      await myAccountPage.menuLink(ORDERS.menu).click({ noWaitAfter: true });
      await expect(page).toHaveURL(`${BASE}${ORDERS.path}`, { timeout: 90_000 });
      await myAccountPage.waitForScripts();
    });

    test('email confirmation message is displayed in Latvian', async ({ myAccountPage, page }) => {
      await expect(page).toHaveTitle(MY_ACCOUNT.title);
      await expect(myAccountPage.verifyNotice).toContainText(ORDERS.verifyText);
      await expect(myAccountPage.verifyNotice.getByRole('link', { name: ORDERS.verifyButton })).toBeVisible();
    });

    test('orders table titles and action buttons are displayed in Latvian', async ({ myAccountPage }) => {
      for (const column of ORDERS.columns) {
        await expect(myAccountPage.columnHeader(column)).toBeVisible();
      }
      const row = myAccountPage.orderRows.first();
      await expect(myAccountPage.orderButton(row, ORDERS.viewButton)).toBeVisible();
      await expect(myAccountPage.orderButton(row, ORDERS.invoiceButton)).toBeVisible();
    });

    test('"Skatīt" opens the order with titles in Latvian', async ({ myAccountPage, page }) => {
      const row = myAccountPage.orderRows.first();
      await myAccountPage.orderButton(row, ORDERS.viewButton).click({ noWaitAfter: true });
      await expect(page).toHaveURL(ORDER_VIEW.path, { timeout: 90_000 });

      await expect(myAccountPage.orderIntro).toHaveText(ORDER_VIEW.intro);
      for (const heading of ORDER_VIEW.headings) {
        await expect(myAccountPage.content.getByText(heading, { exact: true }).first(), heading).toBeVisible();
      }
      await expect(myAccountPage.content.getByRole('link', { name: ORDERS.invoiceButton })).toBeVisible();
    });

    test('"Pavadzīme" downloads the invoice PDF', async ({ myAccountPage, page }) => {
      const row = myAccountPage.orderRows.first();
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 90_000 }),
        myAccountPage.orderButton(row, ORDERS.invoiceButton).click({ noWaitAfter: true }),
      ]);
      expect(download.suggestedFilename()).toMatch(ORDERS.invoiceFile);
      expect(await download.failure()).toBeNull();
    });
  });

  test.describe('addresses', () => {
    test.beforeEach(async ({ myAccountPage, page }) => {
      await myAccountPage.menuLink(ADDRESSES.menu).click({ noWaitAfter: true });
      await expect(page).toHaveURL(`${BASE}${ADDRESSES.path}`, { timeout: 90_000 });
      await myAccountPage.waitForScripts();
    });

    test('address page shows both addresses with edit links', async ({ myAccountPage }) => {
      await expect(myAccountPage.addressIntro).toHaveText(ADDRESSES.intro);
      for (const heading of ADDRESSES.headings) {
        await expect(myAccountPage.heading2(heading)).toBeVisible();
      }
      await expect(myAccountPage.content.getByRole('link', { name: ADDRESSES.editBilling })).toBeVisible();
      await expect(myAccountPage.content.getByRole('link', { name: ADDRESSES.editShipping })).toBeVisible();
    });

    test('billing address form has titles and labels in Latvian', async ({ myAccountPage, page }) => {
      await myAccountPage.content.getByRole('link', { name: ADDRESSES.editBilling }).click({ noWaitAfter: true });
      await expect(page).toHaveURL(`${BASE}${ADDRESSES.billingPath}`, { timeout: 90_000 });

      await expect(page).toHaveTitle(MY_ACCOUNT.title);
      await expect(myAccountPage.heading2(ADDRESSES.billingHeading)).toBeVisible();
      for (const [fieldId, text] of Object.entries(ADDRESSES.billingLabels)) {
        await expect(myAccountPage.label(fieldId), `label of ${fieldId}`).toContainText(text);
      }
      for (const [fieldId, placeholder] of Object.entries(ADDRESSES.placeholders)) {
        await expect(myAccountPage.input(fieldId)).toHaveAttribute('placeholder', placeholder);
      }
      await expect(myAccountPage.saveAddressButton).toBeVisible();
    });
  });

  test.describe('profile information', () => {
    test.beforeEach(async ({ myAccountPage, page }) => {
      await myAccountPage.menuLink(PROFILE.menu).click({ noWaitAfter: true });
      await expect(page).toHaveURL(`${BASE}${PROFILE.path}`, { timeout: 90_000 });
      await myAccountPage.waitForScripts();
    });

    test('profile form has title, labels and the user name hint in Latvian', async ({ myAccountPage, page }) => {
      await expect(page).toHaveTitle(MY_ACCOUNT.title);
      for (const [fieldId, text] of Object.entries(PROFILE.labels)) {
        await expect(myAccountPage.label(fieldId), `label of ${fieldId}`).toContainText(text);
      }
      await expect(myAccountPage.passwordFieldset.locator('legend')).toHaveText(PROFILE.passwordSection);
      await expect(myAccountPage.displayNameHint()).toHaveText(PROFILE.displayNameHint);
      await expect(myAccountPage.saveProfileButton).toBeVisible();
    });

    test('different new passwords show "Jaunās paroles nesakrīt."', async ({ myAccountPage }) => {
      await myAccountPage.fillPasswords(
        PROFILE.randomCurrentPassword,
        PROFILE.randomNewPassword,
        PROFILE.randomConfirmPassword,
      );
      await myAccountPage.saveProfileButton.click({ noWaitAfter: true });
      await expect(myAccountPage.errors).toHaveText([PROFILE.mismatchMessage], { timeout: 90_000 });
    });
  });
});
