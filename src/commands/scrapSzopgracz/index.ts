import { Command, Flags } from '@oclif/core';
import ShopSzopgracz from '@scrapers/Szopgracz';
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
      this.log(`>>> Scraping Szopgracz ${i + 1} time <<<`);
      try {
        // should improve error handling
        let sklep = new ShopSzopgracz();

        const szopgraczLastPage = await sklep.szopgraczPages();

        for (
          let szopgraczPage = 1;
          szopgraczPage <= Number(szopgraczLastPage);
          szopgraczPage++
        ) {
          const products = await sklep.szopgraczProducts(szopgraczPage);

          const now = new Date();
          const currentDate = `${now.getDate()}_${now.getMonth()}_${now.getFullYear()}`;

          let saveShopData = new saveData();
          saveShopData.saveJSONFile(
            'Szopgracz',
            szopgraczPage,
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
