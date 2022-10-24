// import { Scraper } from 'scraper';
const Scraper = require('scraper');
const fs = require('fs');

let scraper = new Scraper();
const products = scraper.scrapShop();

const logger = fs.createWriteStream('data.txt', { flag: 'w' }); // Maybe it is better to use JSON?
logger.write(JSON.stringify(products, null, ' '));
