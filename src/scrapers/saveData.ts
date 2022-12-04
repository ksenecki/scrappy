import * as fs from 'fs';

class saveData {
  async saveJSONFile(
    shopName: string,
    shopPageNumber: number,
    products: any,
    currentDate: string
  ) {
    fs.access(
      `${shopName}_${currentDate}_data.json`,
      fs.constants.F_OK | fs.constants.W_OK,
      (err) => {
        if (err) {
          const logger = fs.createWriteStream(
            `${shopName}_${currentDate}_data.json`,
            {
              flags: 'w',
            }
          );
          logger.write(JSON.stringify(products, null, ' '));
          console.log(
            `${shopName}_${currentDate}_data.json file created with ${shopName} ${shopPageNumber} page data`
          );
        } else {
          let data = fs.readFileSync(
            `${shopName}_${currentDate}_data.json`,
            'utf8'
          );
          let currentObject = JSON.parse(data);
          currentObject.push(products);
          let newData = JSON.stringify(currentObject, null, ' ');
          fs.writeFile(
            `${shopName}_${currentDate}_data.json`,
            newData,
            (err) => {
              // Error checking
              if (err) throw err;
              console.log(
                `${shopPageNumber} page of ${shopName} shop data added to ${shopName}_${currentDate}_data.json`
              );
            }
          );
        }
      }
    );
  }
}

export default saveData;
