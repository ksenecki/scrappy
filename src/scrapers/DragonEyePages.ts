import * as random_useragent from 'random-useragent';
import { chromium } from '@playwright/test';
import { doesNotThrow } from 'assert';

const BASE_URL = 'https://dragoneye.pl/';

class ShopDragonEyePages {
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

export default ShopDragonEyePages;
