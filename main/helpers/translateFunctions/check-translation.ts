import fs from "fs";
import path from "path";

export default async function checkTranslation(localization) {
  return new Promise((resolve, reject) => {
    const userCfgPath = path.join(localization, "user.cfg");
    const LocalizationDir = path.join(localization, "data", "Localization", "french_(france)");
    const globalIniPath = path.join(LocalizationDir, "global.ini");

    if (!fs.existsSync(userCfgPath) || !fs.existsSync(LocalizationDir) || !fs.existsSync(globalIniPath)) {
      resolve(false);
    } else {
      resolve(true);
    }
  });
}