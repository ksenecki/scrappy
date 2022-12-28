import { chromium } from '@playwright/test';
import * as random_useragent from 'random-useragent';

const BASE_URL = 'https://planszostrefa.pl';

class ShopPlanszostrefa {
  async planszostrefaProducts(pageNumber: number) {
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

          const now = new Date();
          const currentTime = `${now.getHours()}:${now.getMinutes()}:${now.getUTCSeconds()}-${now.getDate()}-${now.getMonth()}-${now.getFullYear()}`;

          return {
            date: currentTime,
            shop: 'DragonEye',
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

  async dragonEyePages() {
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

    await page.goto(BASE_URL + `gry-planszowe-c-15.html?page=1&sort=1a`);

    const lastPage = await page.locator('.pageResults u').nth(-2).innerText();

    await browser.close();
    return lastPage;
  }
}

export default ShopPlanszostrefa;
