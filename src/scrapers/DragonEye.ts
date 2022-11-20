import * as random_useragent from 'random-useragent';
import { chromium } from '@playwright/test';

const BASE_URL = 'https://dragoneye.pl/';

class ShopDragonEye {
  async dragonEye(pageNumber: number) {
    const agent = random_useragent.getRandom();

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      bypassCSP: true,
      userAgent: agent,
    });
    const page = await context.newPage();

    // https://dragoneye.pl/gry-planszowe-c-15.html?page=1&sort=1a

    await page.setDefaultTimeout(30000);
    await page.setViewportSize({ width: 800, height: 600 });

    await page.goto(
      BASE_URL + `gry-planszowe-c-15.html?page=${pageNumber}&sort=1a`
    );

    const products = await page.$$eval(
      '.listing .boxProdSmall',
      (productArticles) => {
        return productArticles.map((product) => {
          const title =
            product.querySelectorAll('.center .nazwa')[0].textContent;
          const regExp = new RegExp('\u00A0', 'g');
          const price = product
            .querySelectorAll('.center .cena .cenaBrutto')[0]
            .textContent?.replace(regExp, ' ');

          const infoBox = product.querySelectorAll('.center p');
          const shipmentTime = infoBox[infoBox.length - 2].textContent;
          const availability = infoBox[infoBox.length - 1].textContent;

          const url = product.querySelectorAll('a')[0].href;

          const formatText = (element?: string | null) => element?.trim();

          return {
            title: formatText(title),
            price: formatText(price),
            shipment: formatText(shipmentTime),
            availability: formatText(availability),
            url: url,
          };
        });
      }
    );

    //TODO: get max page number data so it is not fixed in index.ts

    // const pageUrl = await page.locator('.flbox .flRight a').textContent;
    // const allPages = await page.locator('.flbox .flRight u').textContent;
    // const formatText = (element?: string | null) => element?.trim();

    await browser.close();
    return products;
  }
}

export default ShopDragonEye;
