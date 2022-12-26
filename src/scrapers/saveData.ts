import * as fs from 'fs';

class saveData {
  async saveJSONFile(
    shopName: string,
    shopPageNumber: number,
    products: any,
    currentDate: string
  ) {
    const dir = `./results/${currentDate}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.access(
      `./results/${currentDate}/${shopName}_${currentDate}_data.json`,
      fs.constants.F_OK | fs.constants.W_OK,
      (err) => {
        if (err) {
          const logger = fs.createWriteStream(
            `./results/${currentDate}/${shopName}_${currentDate}_data.json`,
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
            `./results/${currentDate}/${shopName}_${currentDate}_data.json`,
            'utf8'
          );
          let currentObject = JSON.parse(data);
          currentObject.push(products);
          let newData = JSON.stringify(currentObject, null, ' ');
          fs.writeFile(
            `./results/${currentDate}/${shopName}_${currentDate}_data.json`,
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
