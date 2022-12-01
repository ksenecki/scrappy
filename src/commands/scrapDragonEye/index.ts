import { Command, Flags } from '@oclif/core';
import ShopDragonEyeProducts from '@scrapers/DragonEye';
import ShopDragonEyePages from '@scrapers/DragonEyePages';
import saveData from '@scrapers/saveData';

export default class Scrap extends Command {
  static description = 'run scrapers';

  static examples = [
    `$ Scraping shop N time
  Scraping playground (./src/commands/scrap/index.ts)
  `,
  ];

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
      this.log(`>>> Scrappy runs ${i + 1} time <<<`);
      try {
        // should improve error handling
        let sklep = new ShopDragonEyeProducts();
        let DragonEyePages = new ShopDragonEyePages();

        const dragonEyeLastPage = await DragonEyePages.dragonEyePages();
        for (
          let dragonEyePage = 1;
          dragonEyePage <= Number(dragonEyeLastPage);
          dragonEyePage++
        ) {
          const products = await sklep.dragonEyeProducts(dragonEyePage);

          const now = new Date();
          const currentDate = `${now.getDate()}_${now.getMonth()}_${now.getFullYear()}`;

          let saveShopData = new saveData();
          saveShopData.saveJSONFile(
            'DragonEye',
            dragonEyePage,
            products,
            currentDate
          );
        }
      } catch (error) {
        // should improve error handling
        console.log(error);
        process.exit(1);
      }
    }
  }
}
