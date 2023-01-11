import { chromium } from '@playwright/test';
import * as random_useragent from 'random-useragent';

const BASE_URL = 'https://shopgracz.pl/';

class ShopShopgracz {
  async shopgraczProducts(pageNumber: number) {
    const agent = random_useragent.getRandom();

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      bypassCSP: true,
      userAgent: agent,
    });
    const page = await context.newPage();

    // https://shopgracz.pl/19-gry-planszowe
    // available filter: https://shopgracz.pl/19-gry-planszowe/s-3/dostepny-tak/?page=1&order=product.sales.desc

    await page.setDefaultTimeout(30000);
    await page.setViewportSize({ width: 800, height: 600 });

    await page.goto(
      BASE_URL +
        `19-gry-planszowe/s-3/dostepny-tak/?page=${pageNumber}&order=product.sales.desc`
    );

    const products = await page.$$eval(
      '.item-product .js-product-miniature',
      (productArticles) => {
        return productArticles.map((product) => {
          const title = product.querySelectorAll(
            '.product_desc .product_name'
          )[0].textContent;
          const regExp = new RegExp('\u00A0', 'g');
          const regExpComma = new RegExp(',', 'g');
          const regExpPLN = new RegExp(' zł', 'g');
          const allPrices = product
            .querySelectorAll(
              '.product_desc .product-price-and-shipping .price'
            )[0]
            .textContent?.replace(regExp, ' ')
            .replace(regExpComma, '.')
            .replace(regExpPLN, '');
          const prices = allPrices?.match(/\d+\.\d+/);
          const price = prices && prices[prices.length - 1];

          const shipmentTime = 'n/a';
          const availabilityUrl = product.querySelectorAll(
            '.product_desc .product-price-and-shipping [itemprop=availability]'
          )[0] as HTMLAnchorElement;
          const availability = availabilityUrl.href.replace(
            'https://schema.org/',
            ''
          );

          const image = product.querySelectorAll(
            '.img_block a'
          )[0] as HTMLAnchorElement;
          const url = image.href;

          const formatText = (element?: string | null) => element?.trim();

          const now = new Date();
          const currentTime = `${now.getHours()}:${now.getMinutes()}:${now.getUTCSeconds()}-${now.getDate()}-${now.getMonth()}-${now.getFullYear()}`;

          return {
            date: currentTime,
            shop: 'Szopgracz',
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

  async shopgraczPages() {
    const agent = random_useragent.getRandom();

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      bypassCSP: true,
      userAgent: agent,
    });
    const page = await context.newPage();

    await page.setDefaultTimeout(30000);
    await page.setViewportSize({ width: 800, height: 600 });

    await page.goto(
      BASE_URL +
        `19-gry-planszowe/s-3/dostepny-tak/?page=1&order=product.sales.desc`
    );

    const lastPage = await page.locator('.page-list li a').nth(-2).innerText();

    await browser.close();
    return lastPage;
  }
}

export default ShopShopgracz;
