import * as fs from 'fs';
import * as random_useragent from 'random-useragent';
import { Command, Flags } from '@oclif/core';
import { chromium } from '@playwright/test';

const BASE_URL = 'http://skleptest.pl/';

export default class Scrap extends Command {
  static description = 'run scrapers';

  static examples = ['<%= config.bin %> <%= command.id %>'];
  static flags = {
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: Flags.boolean({ char: 'f' }),
  };
  static args = [{ name: 'file' }];

  async run(): Promise<void> {
    //const {args, flags} = await this.parse(Scrap)

    this.log(`SCRAPPY WORKS`);
    try {
      //lepszy error handling
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
            const [url] = product.querySelectorAll('a');
            const [title] = product.querySelectorAll('a h2');
            const [price] = product.querySelectorAll('a .price');
            // Check how to simplify this ^
            const formatText = (element: any) =>
              element && element.innerText.trim(); // do poprawki typowanie

            return {
              title: formatText(title),
              price: formatText(price),
              url: url.href,
            };
          });
        }
      );

      const logger = fs.createWriteStream('data.txt', { flags: 'w' }); // Maybe it is better to use JSON?
      logger.write(JSON.stringify(products, null, ' '));

      await browser.close();
    } catch (error) {
      // do zmiany, ale na razie działa
      console.log(error);
      process.exit(1);
    }
  }
}
