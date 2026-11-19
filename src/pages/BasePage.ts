import { type Page } from '@playwright/test';

/** Common behaviour shared by all page objects. Locators live only in page/component classes. */
export abstract class BasePage {
  /** Path relative to baseURL, e.g. '/' */
  protected abstract readonly path: string;

  constructor(protected readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
  }

  async title(): Promise<string> {
    return this.page.title();
  }

  /**
   * The site delays its scripts (LiteSpeed "delay JS") until the first user interaction, and the page
   * widgets only react once they are loaded. A mouse move triggers loading; the scripts are loaded when no
   * delayed script tag is left in the document.
   */
  async waitForScripts(): Promise<void> {
    await this.page.mouse.move(400 + Math.round(Math.random() * 100), 300);
    await this.page.waitForFunction(() => !document.querySelector('script[type="litespeed/javascript"]'), undefined, {
      timeout: 90_000,
    });
  }
}
