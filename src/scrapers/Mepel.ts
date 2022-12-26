import * as random_useragent from 'random-useragent';
import { chromium } from '@playwright/test';

const BASE_URL = 'https://mepel.pl/';

class ShopMepel {
  async mepelProducts(pageNumber: number) {
    const agent = random_useragent.getRandom();

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      bypassCSP: true,
      userAgent: agent,
    });
    const page = await context.newPage();

    //https://mepel.pl/gry-planszowe/1

    await page.setDefaultTimeout(30000);
    await page.setViewportSize({ width: 800, height: 600 });

    await page.goto(BASE_URL + `gry-planszowe/${pageNumber}`);

    const products = await page.$$eval(
      '.product .product-inner-wrap',
      (productArticles) => {
        return productArticles.map((product) => {
          const title = product.querySelectorAll(
            '.product-title .productname'
          )[0].textContent;
          const regExp = new RegExp('\u00A0', 'g');
          const price = product
            .querySelectorAll('.price')[0]
            .textContent?.replace(regExp, ' ');

          const shipmentTime = 'n/a';
          const availability =
            product.querySelectorAll('.availability')[0].textContent;

          const image = product.querySelectorAll(
            '.product-photo .prodimage'
          )[0] as HTMLAnchorElement;
          const url = image.href;

          const formatText = (element?: string | null) => element?.trim();

          const now = new Date();
          const currentTime = `${now.getHours()}:${now.getMinutes()}:${now.getUTCSeconds()}-${now.getDate()}-${now.getMonth()}-${now.getFullYear()}`;

          return {
            date: currentTime,
            shop: 'Mepel',
            title: formatText(title),
            price: formatText(price),
            shipment: formatText(shipmentTime),
            availability: formatText(availability),
            url: url,
          };
        });
      }
    );

    await browser.close();
    return products;
  }

  async mepelPages() {
    const agent = random_useragent.getRandom();

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      bypassCSP: true,
      userAgent: agent,
    });
    const page = await context.newPage();

    await page.setDefaultTimeout(30000);
    await page.setViewportSize({ width: 800, height: 600 });

    await page.goto(BASE_URL + `gry-planszowe/1`);

    const lastPage = await page.locator('.paginator li a').last().innerText();

    await browser.close();
    return lastPage;
  }
}

export default ShopMepel;
