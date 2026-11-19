import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Header } from '../components/Header';
import { InstagramFeed } from '../components/InstagramFeed';

export class ContactsPage extends BasePage {
  protected readonly path = '/kontakti/';

  readonly header: Header;
  readonly instagram: InstagramFeed;

  readonly mapFrame: Locator;

  readonly shopBox: Locator;
  readonly shopSubtitle: Locator;
  readonly shopHeading: Locator;
  readonly shopText: Locator;
  readonly phoneLink: Locator;
  readonly emailLink: Locator;
  readonly readMoreLink: Locator;

  readonly faqHeading: Locator;
  readonly faqItems: Locator;

  readonly formHeading: Locator;
  readonly form: Locator;
  readonly submitButton: Locator;
  readonly requiredLegend: Locator;
  readonly validationSummary: Locator;

  constructor(private readonly pageRef: Page) {
    super(pageRef);
    this.header = new Header(pageRef);
    this.instagram = new InstagramFeed(pageRef, 'Seko mums Instagram');

    this.mapFrame = pageRef.locator('iframe[src*="google.com/maps"]');

    this.shopBox = pageRef.locator('.wd-info-box');
    this.shopSubtitle = this.shopBox.locator('.info-box-subtitle');
    this.shopHeading = this.shopBox.locator('.info-box-title');
    this.shopText = this.shopBox.locator('.info-box-inner');
    this.phoneLink = this.shopText.locator('a[href^="tel:"]');
    this.emailLink = this.shopText.locator('a[href^="mailto:"]');
    this.readMoreLink = this.shopBox.getByRole('link', { name: 'Lasīt vairāk' });

    this.faqHeading = pageRef.getByRole('heading', { name: 'BIEŽI UZDOTIE JAUTĀJUMI' });
    this.faqItems = pageRef.locator('.wd-accordion-item');

    this.formHeading = pageRef.getByRole('heading', { name: 'SAZINIETIES AR MUMS' });
    this.form = pageRef.locator('#gform_wrapper_1');
    this.submitButton = this.form.getByRole('button', { name: 'Sūtīt' });
    this.requiredLegend = this.form.locator('.gform_required_legend');
    this.validationSummary = this.form.locator('.gform_validation_errors');
  }

  // ---------- FAQ ----------

  faqItem(question: string): Locator {
    return this.faqItems.filter({ has: this.pageRef.locator('.wd-accordion-title', { hasText: question }) });
  }

  faqTitle(item: Locator): Locator {
    return item.locator('.wd-accordion-title');
  }

  faqContent(item: Locator): Locator {
    return item.locator('.wd-accordion-content');
  }

  /** Opens or closes an accordion item and waits until it is in the requested state. */
  async setFaqOpen(item: Locator, open: boolean): Promise<void> {
    await expect(async () => {
      const isOpen = await this.faqTitle(item).evaluate((el) => el.classList.contains('wd-active'));
      if (isOpen !== open) await this.faqTitle(item).click();
      if (open) await expect(this.faqContent(item)).toBeVisible({ timeout: 3_000 });
      else await expect(this.faqContent(item)).toBeHidden({ timeout: 3_000 });
    }).toPass({ timeout: 60_000 });
  }

  // ---------- form ----------

  field(id: string): Locator {
    return this.form.locator(`#${id}`);
  }

  fieldLabel(id: string): Locator {
    return this.field(id).locator('label.gfield_label');
  }

  fieldError(id: string): Locator {
    return this.field(id).locator('.gfield_validation_message');
  }

  /** Presses "Sūtīt" with the form as it is and waits for the validation summary. */
  async submitExpectingErrors(): Promise<void> {
    await this.waitForScripts();
    await this.submitButton.click({ noWaitAfter: true });
    await expect(this.validationSummary).toBeVisible({ timeout: 90_000 });
  }
}
