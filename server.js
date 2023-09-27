//DEPENDENCIES
const express = require("express");
const path = require("path");
const fs = require("fs");
const notes = require("./db/db.json");
const { v4: uuidv4 } = require("uuid");

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
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      id: uuidv4(),
      title,
      text,
    };

    const response = {
      status: "sucess",
      body: newNote,
    };

    fs.readFile("./db/db.json", "utf-8", (err, data) => {
      if (err) {
        console.log(err);
      } else {
        //parse string data
        const newData = JSON.parse(data);
        //push object into db
        newData.push(newNote);
        //write db
        fs.writeFile("./db/db.json", JSON.stringify(newData), (err) =>
          err ? console.log(err) : console.log("success")
        );
      }
    });

    res.status(200).json(response);
    console.log(response);
  } else {
    res.status(500).json("Error posting");
  }
});

app.delete("/api/notes/:id", (req, res) => {
  //save req id
  const id = req.params.id;

  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      //parse string data
      const newData = JSON.parse(data);
      //iterate each obj and compare id
      for (let i = 0; i < newData.length; i++) {
        if (newData[i].id === id) {
          //deletes obj and stores deleted obj
          const deleted = newData.splice(i, 1);
          //re writes file
          fs.writeFile("./db/db.json", JSON.stringify(newData), (err) =>
            err ? console.log(err) : console.log(`deleted ${deleted}`)
          );
        }
      }
    }
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

//listen to server
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
