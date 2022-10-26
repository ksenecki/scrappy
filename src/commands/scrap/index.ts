import * as fs from 'fs';
import * as random_useragent from 'random-useragent';
import { Command, Flags } from '@oclif/core';
import { chromium } from '@playwright/test';

const BASE_URL = 'http://skleptest.pl/';

export default class Scrap extends Command {
  static description = 'run scrapers';

  static examples = ['<%= ./bin/dev scrap 5 %> <%= Scrappy runs 1 time %>'];
  static flags = {
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: Flags.boolean({ char: 'f' }),
  };
  static args = [
    {
      name: 'iterations',
      description: 'Number of iterations',
      required: false,
    },
  ];

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Scrap);
    let iter = 1;
    if (args.iterations) iter = args.iterations;
    for (let i = 0; i < iter; i++) {
      this.log(`Scrappy runs ${i + 1} time`);
      try {
        // should improve error handling
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
          }
        );

        const logger = fs.createWriteStream('data.json', { flags: 'w' });
        logger.write(JSON.stringify(products, null, ' '));

        await browser.close();
      } catch (error) {
        // should improve error handling
        console.log(error);
        process.exit(1);
      }
    }
  }
}
