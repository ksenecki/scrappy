import * as random_useragent from 'random-useragent';
import { chromium } from '@playwright/test';

const BASE_URL = 'http://skleptest.pl/';

export class Scraper {
  async scrapShop() {
    // ^ how does it even work?
    try {
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

      const products = await page.$$eval(
        'ul.products li',
        (productArticles) => {
          return productArticles.map((product) => {
            // not sure how to properly fix typings here
            // @ts-ignore
            const [url] = product.querySelectorAll('a');
            // @ts-ignore
            const [title] = product.querySelectorAll('a h2');
            // @ts-ignore
            const [price] = product.querySelectorAll('a .price');
            // Check how to simplify this ^
            const formatText = (element) => element && element.innerText.trim();

            return {
              title: formatText(title),
              price: formatText(price),
              url: url.href,
            };
          });
        }
      );

      await browser.close();
      return products;
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
}
