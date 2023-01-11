import { Command, Flags } from '@oclif/core';
import ShopMepel from '@scrapers/Mepel';
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

  static flags = {
    save: Flags.string({
      string: 's',
      description: 'Way to save the data',
      required: false,
    }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Scrap);
    let iter = 1;
    if (args.iterations) iter = args.iterations;
    for (let i = 0; i < iter; i++) {
      this.log(`>>> Scraping Mepel ${i + 1} time <<<`);
      try {
        // should improve error handling
        let sklep = new ShopMepel();

        const mepelLastPage = await sklep.mepelPages();
        for (
          let mepelPage = 1;
          mepelPage <= Number(mepelLastPage);
          mepelPage++
        ) {
          const products = await sklep.mepelProducts(mepelPage);

          const now = new Date();
          const currentDate = `${now.getDate()}_${now.getMonth()}_${now.getFullYear()}`;

          switch (flags.save) {
            case 'json':
              let saveShopData = new saveData();
              saveShopData.saveJSONFile(
                'Mepel',
                mepelPage,
                products,
                currentDate
              );
            default:
              console.log(products);
          }
        }
      } catch (error) {
        // should improve error handling
        console.log(error);
        process.exit(1);
      }
    }
  }
}
