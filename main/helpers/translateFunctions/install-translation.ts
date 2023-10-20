import fs from "fs";
import path from "path";

import axios from "axios";

export default async function installTranslation(localization) {
  
  const userCfgPath = path.join(localization, "user.cfg");

  if (!fs.existsSync(userCfgPath)) {
    await fs.writeFile(
      userCfgPath,
      `g_language = french_(france)\ng_languageAudio = english`,
      { encoding: "utf8" }, (err) => {
        if (err) throw err;
      }
    );
  }

  const liveLocalizationDir = path.join(localization, "data", "Localization", "french_(france)");
  if (!fs.existsSync(liveLocalizationDir)) {
    await fs.mkdir(path.join(localization, "data", "Localization", "french_(france)"), { recursive: true }, (err) => {
      if (err) throw err;
    });
  }

  
  const url = "https://raw.githubusercontent.com/SPEED0U/StarCitizenTranslations/main/french_(france)/global.ini";
  const outputPath = path.join(liveLocalizationDir, "global.ini");

  const response = await axios.get(url);

  fs.writeFileSync(outputPath, "\ufeff"+response.data);

  return true;
}