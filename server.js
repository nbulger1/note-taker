const express = require("express");
const fs = require("fs");
const uuid = require("./helpers/uuid");
const PORT = 3005;
let noteData = require("./db/db.json");

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
      noteData = data;
    }
  });
  res.json(noteData);
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
      review_id: uuid(),
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

// app.delete("/api/notes/:id", (req, res) => {
//   //delete a note - read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.
// });

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
