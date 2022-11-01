import * as fs from 'fs';
import * as random_useragent from 'random-useragent';
import { chromium } from '@playwright/test';

const BASE_URL = 'http://skleptest.pl/';

export class SklepTest {
  async sklepTest(): Promise<void> {
    const agent = random_useragent.getRandom();

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      bypassCSP: true,
      userAgent: agent,
    });
    const page = await context.newPage();

    await page.setDefaultTimeout(30000);
    await page.setViewportSize({ width: 800, height: 600 });
    await page.goto(BASE_URL + 'product-category/most-wanted/');

    const products = await page.$$eval('ul.products li', (productArticles) => {
      return productArticles.map((product) => {
        const title = product.querySelectorAll('a h2')[0].textContent;
        const price = product.querySelectorAll('a .price')[0].textContent;
        const url = product.querySelectorAll('a')[0].href;

        const formatText = (element: string | null) => element?.trim();

        return {
          title: formatText(title),
          price: formatText(price),
          url: url,
        };
      });
    });
    const logger = fs.createWriteStream('data.json', { flags: 'w' });
    logger.write(JSON.stringify(products, null, ' '));
    await browser.close();
  }
}
