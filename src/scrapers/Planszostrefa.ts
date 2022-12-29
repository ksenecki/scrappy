import { chromium } from '@playwright/test';
import * as random_useragent from 'random-useragent';

const BASE_URL = 'https://planszostrefa.pl/';

class ShopPlanszostrefa {
  async planszostrefaProducts(pageNumber: number) {
    const agent = random_useragent.getRandom();

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      bypassCSP: true,
      userAgent: agent,
    });
    const page = await context.newPage();

    // https://planszostrefa.pl/pl/c/GRY-PLANSZOWE/1/1

    await page.setDefaultTimeout(45000);
    await page.setViewportSize({ width: 800, height: 600 });

    await page.goto(BASE_URL + `pl/c/GRY-PLANSZOWE/1/${pageNumber}`);

    const products = await page.$$eval(
      '.product .product-inner-wrap',
      (productArticles) => {
        return productArticles.map((product) => {
          const image = product.querySelectorAll(
            '.prodimage'
          )[0] as HTMLAnchorElement;

          const title = product.querySelectorAll('.productname')[0].textContent;
          const regExp = new RegExp('\u00A0', 'g');
          const regExpComma = new RegExp(',', 'g');
          const regExpPLN = new RegExp(' zł', 'g');
          const allPrices = product
            .querySelectorAll('.price')[0]
            .textContent?.replace(regExp, ' ')
            .replace(regExpComma, '.')
            .replace(regExpPLN, '');
          const prices = allPrices?.match(/\d+\.\d+/);
          const price = prices && prices[prices.length - 1];

          let shipmentTime =
            product.querySelectorAll('.delivery')[0]?.textContent;
          if (!shipmentTime) {
            shipmentTime = 'n/a';
          }
          const availability =
            product.querySelectorAll('.availability')[0].textContent;

          const url = image.href;

          const formatText = (element?: string | null) => element?.trim();

          const now = new Date();
          const currentTime = `${now.getHours()}:${now.getMinutes()}:${now.getUTCSeconds()}-${now.getDate()}-${now.getMonth()}-${now.getFullYear()}`;

          return {
            date: currentTime,
            shop: 'Planszostrefa',
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

  async planszostrefaPages() {
    const agent = random_useragent.getRandom();

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      bypassCSP: true,
      userAgent: agent,
    });
    const page = await context.newPage();

    // https://planszostrefa.pl/pl/c/GRY-PLANSZOWE/1

    await page.setDefaultTimeout(30000);
    await page.setViewportSize({ width: 800, height: 600 });

    await page.goto(BASE_URL + `pl/c/GRY-PLANSZOWE/1`);

    const lastPage = await page
      .locator('.innerbox .paginator li')
      .nth(-2)
      .innerText();

    await browser.close();
    return lastPage;
  }
}

export default ShopPlanszostrefa;
