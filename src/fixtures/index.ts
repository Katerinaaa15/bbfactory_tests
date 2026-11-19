import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ShopPage } from '../pages/ShopPage';
import { ProductPage } from '../pages/ProductPage';
import { ReceiptsPage } from '../pages/ReceiptsPage';
import { RecipePostPage } from '../pages/RecipePostPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { LostPasswordPage } from '../pages/LostPasswordPage';
import { AccountPage } from '../pages/AccountPage';
import { WishlistPage } from '../pages/WishlistPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { ContactsPage } from '../pages/ContactsPage';

type Pages = {
  homePage: HomePage;
  shopPage: ShopPage;
  productPage: ProductPage;
  receiptsPage: ReceiptsPage;
  recipePostPage: RecipePostPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  lostPasswordPage: LostPasswordPage;
  accountPage: AccountPage;
  wishlistPage: WishlistPage;
  myAccountPage: MyAccountPage;
  contactsPage: ContactsPage;
};

/** Custom test object that provides page objects as fixtures. */
export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  shopPage: async ({ page }, use) => {
    await use(new ShopPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  receiptsPage: async ({ page }, use) => {
    await use(new ReceiptsPage(page));
  },
  recipePostPage: async ({ page }, use) => {
    await use(new RecipePostPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  lostPasswordPage: async ({ page }, use) => {
    await use(new LostPasswordPage(page));
  },
  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },
  wishlistPage: async ({ page }, use) => {
    await use(new WishlistPage(page));
  },
  myAccountPage: async ({ page }, use) => {
    await use(new MyAccountPage(page));
  },
  contactsPage: async ({ page }, use) => {
    await use(new ContactsPage(page));
  },
});

export { expect };
