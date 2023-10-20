import fs from "fs";
import path from "path";

import axios from "axios";

export default async function checkTranslationUpToDate(localization) {
  const localGlobalIniPath = path.join(localization, "data", "Localization", "french_(france)", "global.ini");
  const githubGlobalIniUrl = "https://raw.githubusercontent.com/SPEED0U/StarCitizenTranslations/main/french_(france)/global.ini";

  const localGlobalIni = await fs.readFileSync(localGlobalIniPath, "utf8");
  const githubGlobalIniResponse = await axios.get(githubGlobalIniUrl);
  const githubGlobalIni = githubGlobalIniResponse.data;

  return localGlobalIni === githubGlobalIni;
}