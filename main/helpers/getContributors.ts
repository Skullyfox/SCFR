import axios from "axios";
import * as cheerio from "cheerio";

export default async () => {
  interface Contributor {
    name: string;
    role: string;
    total: string;
  }

  const response = await axios.get("https://tradsc.nightriderz.world/contributors");
  if (response.status === 200) {
    const $ = cheerio.load(response.data);

    const contributors: Contributor[] = [];
    $("tr").each((index, element) => {
      const name = $(element).find(".name").text();
      const role = $(element).find(".role").text();
      const total = $(element).find(".total p").text();
      
      contributors.push({
        name,
        role,
        total,
      });
    });

    const filteredContributors = contributors.filter((contributor) => contributor.name);
      
    return filteredContributors;
  } else {
    return "error";
  }
};