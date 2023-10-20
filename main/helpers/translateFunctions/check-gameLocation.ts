import fs from 'fs';

export default function checkGameLocation(path: string) {
  return new Promise((resolve, reject) => {
    if(!path){
      const gameFolderName = 'StarCitizen'
      const isInstalled = fs.existsSync(`C:/Program Files/Roberts Space Industries/${gameFolderName}/`);
      if (!isInstalled) {
        resolve({
          path: null,
          status: false
        });
      } else {
        resolve({
          path: `C:/Program Files/Roberts Space Industries/`,
          status: true
        });
      }
    } else {
      const gameFolderName = 'StarCitizen'
      const isInstalled = fs.existsSync(`${path}/${gameFolderName}`);
      if (!isInstalled) {
        resolve({
          path: null,
          status: false
        });
      } else {
        resolve({
          path: `${path}`,
          status: true
        });
      }
    }
  });
}