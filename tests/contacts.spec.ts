import { test, expect } from '../src/fixtures';
import { BASE } from '../src/data/homepage.data';
import { CONTACT_FORM, CONTACTS, CONTACTS_INSTAGRAM, FAQ, MAP, OUR_SHOP } from '../src/data/contacts.data';

test.describe('Kontakti page', () => {
  test.describe.configure({ timeout: 180_000 });

  test.beforeEach(async ({ homePage, page }) => {
    await homePage.openWithCookiesAccepted();
    await homePage.header.openMenu(CONTACTS.menuName);
    await expect(page).toHaveURL(`${BASE}${CONTACTS.path}`, { timeout: 90_000 });
  });

  test('opens with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(CONTACTS.title);
  });

  test.describe('map', () => {
    test('is displayed and points to the company address', async ({ contactsPage, page }) => {
      await contactsPage.mapFrame.scrollIntoViewIfNeeded();
      await expect(contactsPage.mapFrame).toBeVisible();

      // the embedded map is a search for the company address, so the marker is placed on it
      const src = (await contactsPage.mapFrame.getAttribute('src')) ?? '';
      const query = new URL(src).searchParams.get('q');
      expect(query).toBe(MAP.address);
      expect(new URL(src).searchParams.get('output')).toBe('embed');

      // the map document is loaded in the frame
      await expect.poll(() => page.frames().some((f) => f.url().includes('google.com/maps')), { timeout: 60_000 }).toBe(true);
      const box = await contactsPage.mapFrame.boundingBox();
      expect(box?.height ?? 0).toBeGreaterThan(100);
    });
  });

  test.describe('"Mūsu veikals" section', () => {
    test('shows the company address', async ({ contactsPage }) => {
      await expect(contactsPage.shopSubtitle).toHaveText(OUR_SHOP.subtitle);
      await expect(contactsPage.shopHeading).toHaveText(OUR_SHOP.heading);
      await expect(contactsPage.shopText).toContainText(OUR_SHOP.addressLine);
    });

    test('has correct phone and email links', async ({ contactsPage }) => {
      await expect(contactsPage.phoneLink).toHaveText(OUR_SHOP.phoneText);
      await expect(contactsPage.phoneLink).toHaveAttribute('href', OUR_SHOP.phoneHref);
      await expect(contactsPage.emailLink).toHaveText(OUR_SHOP.email);
      await expect(contactsPage.emailLink).toHaveAttribute('href', OUR_SHOP.emailHref);
    });

    test('"Lasīt vairāk" opens the "Par mums" page', async ({ contactsPage, page }) => {
      await expect(contactsPage.readMoreLink).toHaveAttribute('href', OUR_SHOP.readMoreHref);
      await contactsPage.readMoreLink.click({ noWaitAfter: true });
      await expect(page).toHaveURL(`${BASE}${OUR_SHOP.aboutPath}`, { timeout: 90_000 });
      await expect(page).toHaveTitle(OUR_SHOP.aboutTitle);
    });
  });

  test.describe('frequently asked questions', () => {
    test('all questions are listed', async ({ contactsPage }) => {
      await expect(contactsPage.faqHeading).toBeVisible();
      await expect(contactsPage.faqItems).toHaveCount(FAQ.questions.length);
      for (const question of FAQ.questions) {
        await expect(contactsPage.faqTitle(contactsPage.faqItem(question))).toBeVisible();
      }
    });

    for (const question of FAQ.questions) {
      test(`"${question}" can be opened and closed`, async ({ contactsPage }) => {
        await contactsPage.waitForScripts();
        const item = contactsPage.faqItem(question);
        await item.scrollIntoViewIfNeeded();

        await contactsPage.setFaqOpen(item, true);
        await expect(contactsPage.faqContent(item)).toBeVisible();
        await expect(contactsPage.faqContent(item)).not.toBeEmpty();

        await contactsPage.setFaqOpen(item, false);
        await expect(contactsPage.faqContent(item)).toBeHidden();

        // and it can be opened again
        await contactsPage.setFaqOpen(item, true);
      });
    }
  });

  test.describe('contact form', () => {
    test('shows heading, labels and the mandatory fields legend', async ({ contactsPage }) => {
      await expect(contactsPage.formHeading).toBeVisible();
      await expect(contactsPage.requiredLegend).toContainText(CONTACT_FORM.requiredLegend);
      for (const [id, text] of Object.entries(CONTACT_FORM.labels)) {
        await expect(contactsPage.fieldLabel(id), id).toContainText(text);
      }
      for (const id of CONTACT_FORM.mandatory) {
        await expect(contactsPage.fieldLabel(id).locator('.gfield_required'), id).toBeVisible();
      }
      for (const id of CONTACT_FORM.optional) {
        await expect(contactsPage.fieldLabel(id).locator('.gfield_required'), id).toHaveCount(0);
      }
      await expect(contactsPage.submitButton).toBeVisible();
    });

    test('empty form shows validation messages under each mandatory field and a summary above', async ({
      contactsPage,
    }) => {
      await contactsPage.submitExpectingErrors();

      await expect(contactsPage.validationSummary).toContainText(CONTACT_FORM.summaryMessage);
      for (const id of CONTACT_FORM.mandatory) {
        await expect(contactsPage.fieldError(id), id).toHaveText(CONTACT_FORM.requiredMessage);
      }
      for (const id of CONTACT_FORM.optional) {
        await expect(contactsPage.fieldError(id), id).toHaveCount(0);
      }
    });
  });

  test.describe('Instagram section', () => {
    test('is displayed correctly', async ({ contactsPage }) => {
      await contactsPage.instagram.root.scrollIntoViewIfNeeded();
      await expect(contactsPage.instagram.heading).toBeVisible();
      await expect(contactsPage.instagram.posts).toHaveCount(CONTACTS_INSTAGRAM.reels.length);
      for (const [i, reel] of CONTACTS_INSTAGRAM.reels.entries()) {
        await expect(contactsPage.instagram.posts.nth(i)).toHaveAttribute(
          'href',
          `https://www.instagram.com/reel/${reel}/`,
        );
      }
      await expect(contactsPage.instagram.posts.first()).toBeVisible();
    });
  });
});
