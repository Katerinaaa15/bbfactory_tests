import { test, expect } from '../src/fixtures';
import { BASE } from '../src/data/homepage.data';
import {
  BODY_CATEGORY,
  POST_NAV,
  RECEIPTS,
  RECEIPTS_INSTAGRAM,
  SIDEBAR,
  shareHrefs,
} from '../src/data/receipts.data';
import { looksLatvian, titleParts } from '../src/utils/latvian';

/**
 * Known site problem: /wp-admin/admin-ajax.php answers 404 on https://bbfactory.lv/, so the
 * "Ielādēt vairāk rakstus" button loads nothing. The test is written correctly and tagged @flaky with
 * an annotation. It is never skipped.
 */
const AJAX_FLAKY = {
  type: 'flaky',
  description: 'admin-ajax.php (load more posts) intermittently responds 404 on the site',
};

test.describe('Receptes page', () => {
  test.beforeEach(async ({ homePage, page }) => {
    await homePage.openWithCookiesAccepted();
    await homePage.header.openMenu(RECEIPTS.menuName);
    await expect(page).toHaveURL(`${BASE}${RECEIPTS.path}`, { timeout: 60_000 });
  });

  test('opens with correct title and heading', async ({ receiptsPage, page }) => {
    await expect(page).toHaveTitle(RECEIPTS.title);
    await expect(receiptsPage.heading).toHaveText(RECEIPTS.heading);
  });

  test('shows the sidebar with categories and latest posts', async ({ receiptsPage }) => {
    await expect(receiptsPage.sidebar.getByRole('heading', { name: SIDEBAR.categoriesHeading })).toBeVisible();
    await expect(receiptsPage.sidebar.getByRole('heading', { name: SIDEBAR.latestHeading })).toBeVisible();
    await expect(receiptsPage.categoryLink(BODY_CATEGORY.name)).toBeVisible();
  });

  test.describe('first loaded receipts', () => {
    test(`${RECEIPTS.initialPosts} receipts are loaded`, async ({ receiptsPage }) => {
      await expect(receiptsPage.posts).toHaveCount(RECEIPTS.initialPosts);
    });

    for (let i = 0; i < RECEIPTS.initialPosts; i++) {
      test(`receipt ${i + 1} has image, title, "${RECEIPTS.readMore}" and "${RECEIPTS.shareLabel}" with correct links`, async ({
        receiptsPage,
      }) => {
        const card = receiptsPage.post(i);
        await card.root.scrollIntoViewIfNeeded();

        const title = await card.titleText();
        const url = await card.url();
        expect(title).not.toBe('');
        expect(url).toMatch(new RegExp(`^${BASE}/`));

        await expect(card.image).toBeVisible();
        await expect(card.readMoreLink).toHaveText(RECEIPTS.readMore);
        await expect(card.readMoreLink).toHaveAttribute('href', url);

        // "Dalīties" button shows the sharing links
        await expect(card.shareButton).toBeVisible();
        await card.shareButton.hover();
        await expect(card.shareTooltip).toBeVisible();
        const share = shareHrefs(url);
        for (const network of ['facebook', 'twitter', 'linkedin'] as const) {
          const link = card.shareLink(network);
          await expect(link).toBeVisible();
          await expect(link).toHaveAttribute('href', share[network]);
          await expect(link).toHaveAttribute('target', '_blank');
        }
      });
    }

    test(`"${RECEIPTS.readMore}" opens the receipt page of the first receipt`, async ({ receiptsPage, page }) => {
      const card = receiptsPage.post(0);
      const title = await card.titleText();
      const url = await card.url();
      await card.readMoreLink.click({ noWaitAfter: true });
      await expect(page).toHaveURL(url, { timeout: 60_000 });
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    });
  });

  test(`"${RECEIPTS.loadMore}" loads more receipts`, { tag: '@flaky', annotation: AJAX_FLAKY }, async ({ receiptsPage, page }) => {
    await page.waitForLoadState('networkidle');
    await expect(receiptsPage.posts).toHaveCount(RECEIPTS.initialPosts);
    await expect(receiptsPage.loadMoreButton).toHaveText(RECEIPTS.loadMore);
    await receiptsPage.loadMoreButton.scrollIntoViewIfNeeded();
    await receiptsPage.loadMoreButton.click();
    await expect.poll(() => receiptsPage.posts.count(), { timeout: 30_000 }).toBeGreaterThan(RECEIPTS.initialPosts);
  });

  test.describe('Instagram section', () => {
    test('is displayed with all posts', async ({ receiptsPage }) => {
      await receiptsPage.instagram.root.scrollIntoViewIfNeeded();
      await expect(receiptsPage.instagram.heading).toBeVisible();
      await expect(receiptsPage.instagram.posts).toHaveCount(RECEIPTS_INSTAGRAM.reels.length);
      for (const [i, reel] of RECEIPTS_INSTAGRAM.reels.entries()) {
        await expect(receiptsPage.instagram.posts.nth(i)).toHaveAttribute(
          'href',
          `https://www.instagram.com/reel/${reel}/`,
        );
      }
      await expect(receiptsPage.instagram.posts.first()).toBeVisible();
    });
  });

  test.describe(`category "${BODY_CATEGORY.name}"`, () => {
    test.beforeEach(async ({ receiptsPage, page }) => {
      await receiptsPage.categoryLink(BODY_CATEGORY.name).click({ noWaitAfter: true });
      await expect(page).toHaveURL(`${BASE}${BODY_CATEGORY.path}`, { timeout: 60_000 });
    });

    test('opens with correct page title and heading', async ({ receiptsPage, page }) => {
      await expect(page).toHaveTitle(BODY_CATEGORY.title);
      await expect(receiptsPage.heading).toHaveText(BODY_CATEGORY.heading);
      await expect(receiptsPage.posts.first()).toBeVisible();
    });

    test('titles are written in Latvian', async ({ receiptsPage }) => {
      await expect(receiptsPage.posts.first()).toBeVisible();
      for (const title of await receiptsPage.titles()) {
        expect(looksLatvian(title), `"${title}" is not a valid Latvian title`).toBe(true);
      }
    });

    test('titles containing "/" have every part written in Latvian', async ({ receiptsPage }) => {
      await expect(receiptsPage.posts.first()).toBeVisible();
      const slashTitles = (await receiptsPage.titles()).filter((t) => t.includes('/'));
      test.info().annotations.push({
        type: 'info',
        description: `titles with "/" on this page: ${slashTitles.length ? slashTitles.join('; ') : 'none'}`,
      });
      for (const title of slashTitles) {
        const parts = titleParts(title);
        expect(parts.length, `"${title}" must have text on both sides of "/"`).toBeGreaterThan(1);
        for (const part of parts) {
          expect(looksLatvian(part), `"${part}" in "${title}" is not Latvian`).toBe(true);
        }
      }
    });

    test('each receipt has image, title and read more link', async ({ receiptsPage }) => {
      await expect(receiptsPage.posts.first()).toBeVisible();
      const count = await receiptsPage.posts.count();
      expect(count).toBeGreaterThan(0);
      for (let i = 0; i < count; i++) {
        const card = receiptsPage.post(i);
        await card.root.scrollIntoViewIfNeeded();
        await expect(card.titleLink, `receipt ${i + 1} title`).toBeVisible();
        await expect(card.image, `receipt ${i + 1} image`).toBeVisible();
        await expect
          .poll(() => card.image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0), {
            message: `receipt ${i + 1} image is loaded`,
          })
          .toBe(true);
        await expect(card.readMoreLink, `receipt ${i + 1} read more`).toHaveText(BODY_CATEGORY.readMore);
        await expect(card.readMoreLink).toHaveAttribute('href', await card.url());
      }
    });

    test.describe('first receipt page', () => {
      let title: string;
      let url: string;

      test.beforeEach(async ({ receiptsPage, page }) => {
        const card = receiptsPage.post(0);
        title = await card.titleText();
        url = await card.url();
        await card.titleLink.click({ noWaitAfter: true });
        await expect(page).toHaveURL(url, { timeout: 60_000 });
      });

      test('has the corresponding titles', async ({ recipePostPage, page }) => {
        await expect(recipePostPage.heading).toHaveText(title);
        await expect(page).toHaveTitle(new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*\\| BB Factory$`));
      });

      test(`shows the "${POST_NAV.newer}" and "${POST_NAV.older}" receipts`, async ({ recipePostPage }) => {
        await expect(recipePostPage.newerLabel).toHaveText(POST_NAV.newer);
        await expect(recipePostPage.olderLabel).toHaveText(POST_NAV.older);
        await expect(recipePostPage.newerTitle).not.toBeEmpty();
        await expect(recipePostPage.olderTitle).not.toBeEmpty();
      });

      test('arrows lead to the older receipt and back to the newer one', async ({ recipePostPage, page }) => {
        const olderUrl = (await recipePostPage.olderLink.getAttribute('href')) ?? '';
        const olderTitle = ((await recipePostPage.olderTitle.textContent()) ?? '').trim();

        // forth: older receipt
        await recipePostPage.olderLink.click({ noWaitAfter: true });
        await expect(page).toHaveURL(olderUrl, { timeout: 60_000 });
        await expect(recipePostPage.heading).toHaveText(olderTitle);
        // the older receipt links back to the one we came from
        await expect(recipePostPage.newerLink).toHaveAttribute('href', url);
        await expect(recipePostPage.newerTitle).toHaveText(title);

        // back: newer receipt
        await recipePostPage.newerLink.click({ noWaitAfter: true });
        await expect(page).toHaveURL(url, { timeout: 60_000 });
        await expect(recipePostPage.heading).toHaveText(title);
      });

      test('arrow to the newer receipt opens it and links back to this one', async ({ recipePostPage, page }) => {
        const newerUrl = (await recipePostPage.newerLink.getAttribute('href')) ?? '';
        const newerTitle = ((await recipePostPage.newerTitle.textContent()) ?? '').trim();

        await recipePostPage.newerLink.click({ noWaitAfter: true });
        await expect(page).toHaveURL(newerUrl, { timeout: 60_000 });
        await expect(recipePostPage.heading).toHaveText(newerTitle);
        await expect(recipePostPage.olderLink).toHaveAttribute('href', url);

        await recipePostPage.olderLink.click({ noWaitAfter: true });
        await expect(page).toHaveURL(url, { timeout: 60_000 });
        await expect(recipePostPage.heading).toHaveText(title);
      });
    });
  });
});
