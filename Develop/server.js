//DEPENDENCIES
const express = require("express");
const path = require("path");
const fs = require("fs");
const notes = require("./db/db.json");

//sets port
const PORT = 3001;
// sets server
const app = express();
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => res.json(notes));

app.post("/api/notes", (req, res) => {
  console.log(req.body);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

//listen to server
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
