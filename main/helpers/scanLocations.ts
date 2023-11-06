const { glob } = require('glob');

export default async (executableName: string, version: string) => {
  const searchPattern = `/**/${executableName}`;
  const result = await glob(searchPattern, { nodir: true });

  const executablePath = result.find((path) => path.includes(version));
  const regex = /^(.*?\\Roberts Space Industries).*/;
  const match = executablePath.match(regex);

  return {
    gamePath: match[1]
  }
}
