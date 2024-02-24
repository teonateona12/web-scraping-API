import express from "express";
import * as cheerio from "cheerio";
import axios from "axios";
const app = express();
const port = process.env.PORT || 5001;
const url = "https://www.bdh-online.de/patienten/therapeutensuche/?seite=1";
let results = [];

const fetchData = async () => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    let promises = [];

    $("tbody > tr").each((i, el) => {
      const name = $(el).find("td:nth-child(1)").text().trim();
      const zip = $(el).find("td:nth-child(3)").text().trim();
      const city = $(el).find("td:nth-child(4)").text().trim();
      const detailLink = $(el).find("td:nth-child(6) a").attr("href");

      if (detailLink) {
        const detailUrl = new URL(detailLink, url);
        promises.push(
          axios.get(detailUrl.toString()).then((detailResponse) => {
            const detailPage = cheerio.load(detailResponse.data);
            const aElementText = detailPage("td:nth-child(3) a").text().trim();
            const [firstName, lastName] = name.split(",");
            const person = {
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              zip: parseInt(zip, 10),
              email: aElementText,
              city: city,
            };

            return person;
          })
        );
      }
    });

    results = await Promise.all(promises);
    console.log(results);
  } catch (error) {
    console.error("Error:", error);
  }
};
fetchData();

app.get("/person", (req, res) => {
  res.send(results);
});

app.listen(port, () => console.log("Server is running on port " + port));
