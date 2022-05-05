const express = require("express");
const fs = require("fs");
const uuid = require("generate-unique-id");
const PORT = process.env.PORT || 3005;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//send the index.html to the root directory
app.get("/", (req, res) =>
  res.sendFile(path.join("/public/index.html"), { root: __dirname })
);

//send the notes html when in the notes directory
app.get("/notes", (req, res) =>
  res.sendFile("/public/notes.html", { root: __dirname })
);

app.get("/api/notes", (req, res) => {
  //read the db.json file and return the saved notes
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedNotes = JSON.parse(data);
      return res.json(parsedNotes);
    }
  });
});

app.post("/api/notes", (req, res) => {
  //save a new note to the db.json file and return the new note to the client
  console.info(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    // Obtain existing reviews
    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);
        // Add a new note
        parsedNotes.push(newNote);
        // Write updated reviews back to the file
        fs.writeFile(
          "./db/db.json",
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info("Successfully updated notes!")
        );
      }
    });

    const response = {
      status: "success",
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json("Error in posting note");
  }
});

app.delete("/api/notes/:id", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedNotes = JSON.parse(data);
      const { id } = req.params;

      const noteIndex = parsedNotes.findIndex((p) => p.id == id);

      parsedNotes.splice(noteIndex, 1);

      //   res.send();
      fs.writeFile(
        "./db/db.json",
        JSON.stringify(parsedNotes, null, 4),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info("Successfully updated notes!")
      );
      return res.json(parsedNotes);
    }
  });
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
