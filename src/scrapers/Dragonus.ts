import * as random_useragent from 'random-useragent';
import { chromium } from '@playwright/test';

const BASE_URL = 'https://dragonus.pl/';

class ShopDragonus {
  async dragonusProducts(pageNumber: number) {
    const agent = random_useragent.getRandom();

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      bypassCSP: true,
      userAgent: agent,
    });
    const page = await context.newPage();

    //https://dragonus.pl/pl/c/GRY-PLANSZOWE/173/1

    await page.setDefaultTimeout(30000);
    await page.setViewportSize({ width: 800, height: 600 });

    await page.goto(BASE_URL + `pl/c/GRY-PLANSZOWE/173/${pageNumber}`);

    const products = await page.$$eval(
      '.products tbody .product',
      (productArticles) => {
        return productArticles.map((product) => {
          const title = product.querySelectorAll('.productname')[0].textContent;
          const regExp = new RegExp('\u00A0', 'g');
          const price = product
            .querySelectorAll('.price em')[0]
            .textContent?.replace(regExp, ' ');

          const shipmentAvailable = product.querySelectorAll(
            '.availanddeliv .delivery'
          )[1]?.textContent;
          const shipmentTime = shipmentAvailable ? shipmentAvailable : 'n/a';
          const availability = product.querySelectorAll(
            '.availanddeliv .availability'
          )[1].textContent;

          const image = product.querySelectorAll('a')[0] as HTMLAnchorElement;
          const url = image.href;

          const formatText = (element?: string | null) => element?.trim();

          return {
            title: formatText(title),
            price: formatText(price),
            shipment: shipmentTime,
            availability: formatText(availability),
            url: url,
          };
        });
      }
    );

    await browser.close();
    return products;
  }

  async dragonusPages() {
    const agent = random_useragent.getRandom();

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      bypassCSP: true,
      userAgent: agent,
    });
    const page = await context.newPage();

    await page.setDefaultTimeout(30000);
    await page.setViewportSize({ width: 800, height: 600 });

    await page.goto(BASE_URL + `pl/c/GRY-PLANSZOWE/173/1`);

    const lastPage = await page.locator('.paginator li a').nth(-2).innerText();

    await browser.close();
    return lastPage;
  }
}

export default ShopDragonus;
