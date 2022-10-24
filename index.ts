import * as fs from 'fs';
import { Scraper } from './scraper';

let scraper = new Scraper();
const products = scraper.scrapShop();

const logger = fs.createWriteStream('data.txt', { flags: 'w' }); // Maybe it is better to use JSON?
logger.write(JSON.stringify(products, null, ' '));
