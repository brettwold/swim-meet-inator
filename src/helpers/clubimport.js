import fs from 'fs';
import path from 'path';
import readline from 'readline';
import models from '../models';
import parse from 'csv-parse';
import Utils from '../helpers/utils';

const CLUBLIST_FILE = 'ClubList.csv';

export default class ClubImport {
  importClubs(dir) {
    return this.readStatic(dir, CLUBLIST_FILE);
  }

  readStatic(dir, filename) {
    return new Promise((resolve, reject) => {
      console.log("Reading " + this.exists(dir, filename) +  filename + " from " + dir);

      if(dir && filename && this.exists(dir, filename)) {
        var output = [];
        var parser = parse({delimiter: ',', relax: true, relax_column_count: true });
        parser.on('readable', () => {
          let record;
          while(record = parser.read()){
            output.push(record);
          }
        });
        parser.on('error', (err) => {
          console.log(err.message);
        });
        parser.on('finish', () =>{
          resolve(output);
        });

        var filePath = path.join(dir, filename);
        var input = fs.createReadStream(filePath);
        input.pipe(parser);
      }
    });
  }

  exists(dir, filename) {
    let resFile = path.join(dir, filename);
    try {
      fs.accessSync(resFile, fs.F_OK);
      return true;
    } catch (e) {
      return false;
    }
  }
}
