import { test, expect } from '../src/fixtures';
import { BASE } from '../src/data/homepage.data';
import { ACCOUNT, LOST_PASSWORD, SIDE_LOGIN } from '../src/data/login.data';

test.describe('Login', () => {
  // the site is slow and these flows contain several page loads
  test.describe.configure({ timeout: 240_000 });

  test.describe('side login window', () => {
    test.beforeEach(async ({ homePage }) => {
      await homePage.openWithCookiesAccepted();
      await homePage.openSideLogin();
      await expect(homePage.sideLogin.root).toBeVisible();
    });

    test('is displayed with login fields, buttons and links', async ({ homePage }) => {
      const side = homePage.sideLogin;
      await expect(side.heading).toHaveText(SIDE_LOGIN.heading);
      for (const label of SIDE_LOGIN.labels) {
        await expect(side.label(label)).toBeVisible();
      }
      await expect(side.usernameInput).toBeVisible();
      await expect(side.passwordInput).toBeVisible();
      await expect(side.submitButton).toBeVisible();
      await expect(side.rememberMe).toContainText(SIDE_LOGIN.rememberMe);
      await expect(side.lostPasswordLink).toHaveText(SIDE_LOGIN.lostPassword);
      await expect(side.createAccountLink).toHaveText(SIDE_LOGIN.createAccount);
      await expect(side.createAccountLink).toHaveAttribute('href', `${BASE}${SIDE_LOGIN.createAccountHref}`);
    });

    test('can be closed', async ({ homePage }) => {
      await homePage.sideLogin.closeButton.click();
      await expect(homePage.sideLogin.root).toBeHidden();
    });
  });

  test.describe('lost password page', () => {
    test.beforeEach(async ({ homePage, lostPasswordPage, page }) => {
      await homePage.openWithCookiesAccepted();
      await homePage.openSideLogin();
      await homePage.sideLogin.lostPasswordLink.click({ noWaitAfter: true });
      await expect(page).toHaveURL(`${BASE}${LOST_PASSWORD.path}`, { timeout: 60_000 });
      await lostPasswordPage.waitForScripts();
    });

    test('opens with correct title and form', async ({ lostPasswordPage, page }) => {
      await expect(page).toHaveTitle(LOST_PASSWORD.title);
      await expect(lostPasswordPage.heading).toHaveText(LOST_PASSWORD.heading);
      await expect(lostPasswordPage.loginLabel).toContainText(LOST_PASSWORD.label);
      await expect(lostPasswordPage.submitButton).toBeVisible();
    });

    test('text that is not an email or user name is rejected', async ({ lostPasswordPage }) => {
      await lostPasswordPage.submit(LOST_PASSWORD.randomText);
      await expect(lostPasswordPage.errors).toHaveText([LOST_PASSWORD.invalidMessage], { timeout: 60_000 });
    });

    test('a correctly formatted email of an unknown user is rejected', async ({ lostPasswordPage }) => {
      await lostPasswordPage.submit(LOST_PASSWORD.notRegisteredEmail);
      await expect(lostPasswordPage.errors).toHaveText([LOST_PASSWORD.invalidMessage], { timeout: 60_000 });
    });

    test('"Mans konts" icon opens the account page with login and registration', async ({
      lostPasswordPage,
      accountPage,
      page,
    }) => {
      await lostPasswordPage.header.iconLink('/mans-konts/').click({ noWaitAfter: true });
      await expect(page).toHaveURL(`${BASE}${ACCOUNT.path}`, { timeout: 60_000 });
      await expect(page).toHaveTitle(ACCOUNT.title);
      await expect(accountPage.heading).toHaveText(ACCOUNT.heading);
      await expect(accountPage.loginTitle).toBeVisible();
      await expect(accountPage.registerTitle.first()).toBeVisible();
    });
  });

  test.describe('account page', () => {
    test.beforeEach(async ({ homePage, accountPage, page }) => {
      await accountPage.open();
      await homePage.cookies.accept();
      await accountPage.waitForScripts();
      await expect(page).toHaveURL(`${BASE}${ACCOUNT.path}`);
    });

    test('opens with correct title and shows login and registration', async ({ accountPage, page }) => {
      await expect(page).toHaveTitle(ACCOUNT.title);
      await expect(accountPage.heading).toHaveText(ACCOUNT.heading);
      await expect(accountPage.loginTitle).toBeVisible();
      await expect(accountPage.registerTitle.filter({ visible: true }).first()).toBeVisible();
      await expect(accountPage.loginForm).toBeVisible();
      await expect(accountPage.loginSubmit).toBeVisible();
    });

    test.describe('login form', () => {
      test('empty fields show a validation message under each field', async ({ accountPage }) => {
        await accountPage.submitUntilVisible(
          async () => {},
          accountPage.loginSubmit,
          accountPage.fieldError(accountPage.loginForm, accountPage.loginUsername),
        );
        await expect(accountPage.fieldError(accountPage.loginForm, accountPage.loginUsername)).toHaveText(
          ACCOUNT.login.usernameRequired,
        );
        await expect(accountPage.fieldError(accountPage.loginForm, accountPage.loginPassword)).toHaveText(
          ACCOUNT.login.passwordRequired,
        );
      });

      test('only email entered: only the password field has a validation message', async ({ accountPage }) => {
        await accountPage.submitUntilVisible(
          () => accountPage.loginUsername.fill(ACCOUNT.login.email),
          accountPage.loginSubmit,
          accountPage.fieldError(accountPage.loginForm, accountPage.loginPassword),
        );
        await expect(accountPage.fieldError(accountPage.loginForm, accountPage.loginPassword)).toHaveText(
          ACCOUNT.login.passwordRequired,
        );
        await expect(accountPage.fieldError(accountPage.loginForm, accountPage.loginUsername)).toHaveCount(0);
      });

      test('unknown user name and a password show the "not registered" error', async ({ accountPage }) => {
        await accountPage.loginUsername.fill(ACCOUNT.login.unknownUser);
        await accountPage.loginPassword.fill(ACCOUNT.login.password);
        await accountPage.loginSubmit.click();
        await expect(accountPage.serverErrors).toHaveText([ACCOUNT.login.unknownUserMessage], { timeout: 60_000 });
      });
    });

    test.describe('registration form', () => {
      test.beforeEach(async ({ accountPage }) => {
        await accountPage.switchToRegister.click();
        await expect(accountPage.registerForm).toBeVisible();
      });

      test('empty fields show a validation message under each field', async ({ accountPage }) => {
        await accountPage.submitUntilVisible(
          () => accountPage.ensureRegisterForm(),
          accountPage.registerSubmit,
          accountPage.fieldError(accountPage.registerForm, accountPage.registerEmail),
        );
        await expect(accountPage.fieldError(accountPage.registerForm, accountPage.registerEmail)).toHaveText(
          ACCOUNT.register.emailRequired,
        );
        await expect(accountPage.fieldError(accountPage.registerForm, accountPage.registerPassword)).toHaveText(
          ACCOUNT.register.passwordRequired,
        );
      });

      test('only email entered: only the password field has a validation message', async ({ accountPage }) => {
        await accountPage.submitUntilVisible(
          async () => {
            await accountPage.ensureRegisterForm();
            await accountPage.registerEmail.fill(ACCOUNT.register.email);
          },
          accountPage.registerSubmit,
          accountPage.fieldError(accountPage.registerForm, accountPage.registerPassword),
        );
        await expect(accountPage.fieldError(accountPage.registerForm, accountPage.registerPassword)).toHaveText(
          ACCOUNT.register.passwordRequired,
        );
        await expect(accountPage.fieldError(accountPage.registerForm, accountPage.registerEmail)).toHaveCount(0);
      });
    });
  });
});
