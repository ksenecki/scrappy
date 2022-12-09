import { Command, Flags } from '@oclif/core';
import ShopDragonus from '@scrapers/Dragonus';
import saveData from '@scrapers/saveData';

export default class Scrap extends Command {
  static description = 'run scraper';

  static examples = [
    `$ Scraping shop N time
  Scraping playground (./src/commands/scraperName/index.ts)
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
      this.log(`>>> Scraping Dragoneye ${i + 1} time <<<`);
      try {
        // should improve error handling
        let sklep = new ShopDragonus();

        const dragonusLastPage = await sklep.dragonusPages();
        for (
          let dragonusPage = 1;
          dragonusPage <= Number(dragonusLastPage);
          dragonusPage++
        ) {
          const products = await sklep.dragonusProducts(dragonusPage);

          const now = new Date();
          const currentDate = `${now.getDate()}_${now.getMonth()}_${now.getFullYear()}`;
          let saveShopData = new saveData();
          saveShopData.saveJSONFile(
            'DragonusPage',
            dragonusPage,
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
