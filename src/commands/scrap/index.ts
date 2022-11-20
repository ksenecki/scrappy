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

        //TODO: Improve so this number is not fixed
        const dragonEyeTotalPages = 62;
        for (let dragonEyePage = 1; dragonEyePage <= dragonEyeTotalPages; dragonEyePage++){
          const products = await sklep.dragonEye(dragonEyePage);
        

        const now = new Date();
        const currentDate = `${now.getDate()}_${now.getMonth()}_${now.getFullYear()}`;


        fs.access(`${currentDate}_data.json`, fs.constants.F_OK | fs.constants.W_OK, (err) => {
          if (err) {
            const logger = fs.createWriteStream(`${currentDate}_data.json`, { flags: 'w' });
            logger.write(JSON.stringify(products, null, ' '));
            console.log(`${currentDate}_data.json file created with ${dragonEyePage} Dragoneye page data`);
            } else {
              let data = fs.readFileSync(`${currentDate}_data.json`, "utf8");
              let currentObject = JSON.parse(data);
              currentObject.push(products);
              let newData = JSON.stringify(currentObject, null, ' ');
              fs.writeFile(`${currentDate}_data.json`, newData, (err) => {
                // Error checking
                if (err) throw err;
                console.log(`${dragonEyePage} DragonEye page data added to ${currentDate}_data.json`);
              });
          }
        });
      };
        
      } catch (error) {
        // should improve error handling
        console.log(error);
        process.exit(1);
      }
    }
  }
}
