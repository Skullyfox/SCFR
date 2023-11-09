import axios from 'axios';
import childProcess from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { app } from 'electron';

const checkForUpdates = async (currentVersion: string) => {
  const response = await axios.get("https://api.github.com/repos/skullyfox/SCFR/releases/latest");
  const { tag_name } = response.data;
  const { assets } = response.data;
  const latestVersion = tag_name.substring(1);

  if (latestVersion > currentVersion) {
    let setupObject = assets.filter(asset => asset.name.endsWith(`.Setup.${latestVersion}.exe`));
    let downloadUrl = setupObject[0].browser_download_url;
    return {
      "updateAvailable": true,
      "url": downloadUrl,
    };
  } else {
    return {
      "updateAvailable": false,
      "url": "",
    };
  }
};

const downloadUpdate = async (downloadUrl: string) => {
  const tempDir = os.tmpdir();
  const filePath = path.join(tempDir, "update.setup.exe");
  const response = await axios.get(downloadUrl, {
    responseType: "stream",
  });
  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);
  await new Promise((resolve, reject) => {
    writer.on("finish", () => {
      writer.on("close", () => {
        installUpdate(filePath);
        resolve;
      });
    });
    writer.on("error", reject);

  });
};

const installUpdate = async (filePath: string) => {
  const updateProcess = childProcess.spawn(filePath, [], {
    detached: true,
    stdio: "ignore",
  });
  updateProcess.unref();

  app.quit();
};

export { checkForUpdates, installUpdate, downloadUpdate };