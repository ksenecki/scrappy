import * as fs from 'fs';

class saveData {
  async saveJSONFile(
    shopName: string,
    shopPageNumber: number,
    products: any,
    currentDate: string
  ) {
    fs.access(
      `${currentDate}_data.json`,
      fs.constants.F_OK | fs.constants.W_OK,
      (err) => {
        if (err) {
          const logger = fs.createWriteStream(`${currentDate}_data.json`, {
            flags: 'w',
          });
          logger.write(JSON.stringify(products, null, ' '));
          console.log(
            `${currentDate}_data.json file created with ${shopPageNumber} ${shopName} page data`
          );
        } else {
          let data = fs.readFileSync(`${currentDate}_data.json`, 'utf8');
          let currentObject = JSON.parse(data);
          currentObject.push(products);
          let newData = JSON.stringify(currentObject, null, ' ');
          fs.writeFile(`${currentDate}_data.json`, newData, (err) => {
            // Error checking
            if (err) throw err;
            console.log(
              `${shopPageNumber} ${shopName} page data added to ${currentDate}_data.json`
            );
          });
        }
      }
    );
  }
}

export default saveData;
