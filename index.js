import express from "express";

const app = express();
const port = process.env.PORT || 5001;
let results = [];

app.get("/person", (req, res) => {
  res.send(results);
});

app.listen(port, () => console.log("Server is running on port " + port));
