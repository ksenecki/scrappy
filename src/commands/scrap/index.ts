import * as fs from 'fs';
import { Command, Flags } from '@oclif/core';
import ShopDragonEye from '@scrapers/DragonEye';

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
        let sklep = new ShopDragonEye();
        const products = await sklep.dragonEye();

        const logger = fs.createWriteStream('data.json', { flags: 'w' });
        logger.write(JSON.stringify(products, null, ' '));
      } catch (error) {
        // should improve error handling
        console.log(error);
        process.exit(1);
      }
    }
  }
}
