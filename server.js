// Require express, fs, and the generate-unique-id node packages
const express = require("express");
const fs = require("fs");
const uuid = require("generate-unique-id");
// Generate the listening port either for the heroku port or 3005
const PORT = process.env.PORT || 3005;

// Call the express application
const app = express();

//Middleware
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

// When in the notes directory
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

// Post request called when client clicks on the save icon: save a new note to the db.json file and return the new note to the client's saved notes
app.post("/api/notes", (req, res) => {
  //console that the request was received
  console.info(`${req.method} request received to add a note`);

  // Destructure the items in req.body into note title and note text
  const { title, text } = req.body;

  // If both title and text are present
  if (title && text) {
    // Variable for the object we will save with the unique id
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    // Obtain existing notes by reading the db.json file
    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);
        // Add a new note by pushing onto the parsed array
        parsedNotes.push(newNote);
        // Re-write the db.json file with the new parsed notes array
        fs.writeFile(
          "./db/db.json",
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : //console out the the notes were successfully updated
                console.info("Successfully updated notes!")
        );
      }
    });

    //create a variable with the new note and success status
    const response = {
      status: "success",
      body: newNote,
    };
    //return that response as a 201 working type code
    res.status(201).json(response);
  } else {
    //If there was an error then return that there was an error saving the note
    res.status(500).json("Error in saving note");
  }
});

// When the user clicks the trash can icon next to a saved notes and call the delete request
app.delete("/api/notes/:id", (req, res) => {
  //read the db.json file
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      //parse out the array
      const parsedNotes = JSON.parse(data);
      //create an id variable from the clicked note
      const { id } = req.params;

      //create a note index that equals the index of the item in the array with the same id as the id from the clicked note
      const noteIndex = parsedNotes.findIndex((p) => p.id == id);

      //splice that index item out of the parsed notes array
      parsedNotes.splice(noteIndex, 1);

      //re-write the db.json file without the deleted note
      fs.writeFile(
        "./db/db.json",
        JSON.stringify(parsedNotes, null, 4),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info("Successfully updated notes!")
      );
      //return the new parsed notes array to repopulate the saved notes on the left-hand side of the page
      return res.json(parsedNotes);
    }
  });
});

//Tell the application to listen at the defined port variable
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
