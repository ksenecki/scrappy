// import playwright from 'playwright';
// ^ does not work somehow...
// tried adding "type": "module" to package.json and modify tsconfig.json
// for whatever reason I have to use require, imports do not work...

const playwright = require('playwright');
const random_useragent = require('random-useragent');
const fs = require('fs');

const BASE_URL = 'http://skleptest.pl/';

(async () => {
  // ^ how does it even work?
  const agent = random_useragent.getRandom();

  const browser = await playwright.chromium.launch({ headless: true });
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
      // not sure how to properly fix typings here
      const [url] = product.querySelectorAll('a');
      const [title] = product.querySelectorAll('a h2');
      const [price] = product.querySelectorAll('a .price');
      // Check how to simplify this ^
      const formatText = (element) => element && element.innerText.trim();

      return {
        title: formatText(title),
        price: formatText(price),
        url: url.href,
      };
    });
  });

  const logger = fs.createWriteStream('data.txt', { flag: 'w' }); // Maybe it is better to use JSON?
  logger.write(JSON.stringify(products, null, ' '));

  await browser.close();
})().catch((error) => {
  console.log(error);
  console.log(error.stack);
  process.exit(1);
});
