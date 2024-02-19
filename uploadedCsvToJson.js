import fs from 'fs';
import csv from 'fast-csv';

function uploadedCsvToJsonParser(path){
  const fileRows = [];
  return new Promise((resolve) => {
    const stream = fs.createReadStream(path, 'utf-8');
    csv
      .parseStream(stream)
      .on('data', (data) => {
        fileRows.push(data); // push each row
      })
      .on('end', () => {
        fs.unlinkSync(path); // remove temp file
        // process "fileRows" and respond
        console.log(fileRows)
        const columnTitles = fileRows[0][0].split(';');
        if(columnTitles[columnTitles.length-1] !== 'Texto'){
          resolve('error') 
        }
        const archiveJson = (fileRows.slice(1).map((row, index) => {
          const json = {};
          if(index > 0){
            row[0].split(';').forEach((columnValue, indexY) => {
            json[columnTitles[indexY]] = columnValue;
          });
        }
        else {
          console.log(row)
          row[0].split(';').forEach((columnValue, indexY) => {
            if(columnTitles[indexY] != 'Texto')json[columnTitles[indexY]] = columnValue;
            else {
              row.length > 1 ? json[columnTitles[indexY]] = `${row[0].split(';')[indexY]},${row.splice(1).join(',')}` : json[columnTitles[indexY]] = columnValue;
            }
          });
        }
          return json;
        }));
        resolve(archiveJson);
      });
  });
}

export default uploadedCsvToJsonParser;