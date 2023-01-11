import { Command, Flags } from '@oclif/core';
import ShopShopgracz from '@scrapers/Shopgracz';
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
      this.log(`>>> Scraping Shopgracz ${i + 1} time <<<`);
      try {
        // should improve error handling
        let sklep = new ShopShopgracz();

        const shopgraczLastPage = await sklep.shopgraczPages();

        for (
          let shopgraczPage = 1;
          shopgraczPage <= Number(shopgraczLastPage);
          shopgraczPage++
        ) {
          const products = await sklep.shopgraczProducts(shopgraczPage);

          const now = new Date();
          const currentDate = `${now.getDate()}_${now.getMonth()}_${now.getFullYear()}`;

          switch (flags.save) {
            case 'json':
              let saveShopData = new saveData();
              saveShopData.saveJSONFile(
                'Shopgracz',
                shopgraczPage,
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
