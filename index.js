import express from "express";
import * as cheerio from "cheerio";
import axios from "axios";
const app = express();
const port = process.env.PORT || 5001;
const url = "https://www.bdh-online.de/patienten/therapeutensuche/?seite=1";
let results = [];

const fetchData = async () => {
  try {
    let response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const results = [];
    $("tbody > tr").each((i, el) => {
      const name = $(el).find("td:nth-child(1)").text().trim();

      const person = {
        name: name,
      };
      results.push(person);
    });

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
