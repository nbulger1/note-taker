## Note Taker - Week 11 Homework

## Description

I was provided starter code and tasked to create a note taker that a user can use to write and save notes. The application uses Express.js as a back-end and saves/retrieves notes from a JSON file.

Once the front and back end were connected, I deployed the application to Heroku (see link at the bottom of README).

## Table of Contents

- [User Story](#user-story)
- [Acceptance Criteria](#acceptance-criteria)
- [Node Packages](#node-packages)
- [Middleware](#middleware)
- [GET Requests](#get-requests)
- [POST Request](#post-request)
- [DELETE Request](#delete-request)
- [Screen Recording](#screen-recording)
- [Link](#link)

## User Story

```
AS A small business owner
I WANT to be able to write and save notes
SO THAT I can organize my thoughts and keep track of tasks I need to complete
```

## Acceptance Criteria

```
GIVEN a note-taking application
WHEN I open the Note Taker
THEN I am presented with a landing page with a link to a notes page
WHEN I click on the link to the notes page
THEN I am presented with a page with existing notes listed in the left-hand column, plus empty fields to enter a new note title and the note’s text in the right-hand column
WHEN I enter a new note title and the note’s text
THEN a Save icon appears in the navigation at the top of the page
WHEN I click on the Save icon
THEN the new note I have entered is saved and appears in the left-hand column with the other existing notes
WHEN I click on an existing note in the list in the left-hand column
THEN that note appears in the right-hand column
WHEN I click on the Write icon in the navigation at the top of the page
THEN I am presented with empty fields to enter a new note title and the note’s text in the right-hand column
```

## Node Packages

In order to build the server Javascript file, I started by requiring the necessary packages from the node package manager. I needed three different packages to completed the back-end application:

1. Express
2. fs
3. generate-unique-id

## Middleware

Within the server file, I used three pieces of middleware:

1. express.json
2. express.urlencoded
3. express.static

The express.json middleware recognizes incoming data as a JSON object. The urlencoded middleware recognizes incoming data as a string or array. The express.static middleware tells the server to check if any of the static files in the public folder will work for the user request before moving on the GET, POST, and DELETE requests.

## GET Requests

I started out the requests by creating a GET request for the root directory that sends back the index.html file in the public folder. Then I created a GET request for the /notes portion of the page that sends back the notes.html file in the public folder. Finally, I created a GET request that reads the db.json file that holds all the saved notes, parses them, and returns them so the index.js file can populate the saved notes on the left side of the page.

## POST Request

The post request is called when the user clicks the save button after entering a note title and note text content. First the request console logs that the request has been received. Then it breaks up the request body into two seperate variables: title and text. If both title and text are present then the post request creates a new note with the title, text, and a unique id using the node package "generate-unique-id". From there the request reads the db.json file, parses the notes array, pushes the new note onto the array, and then re-writes the db.json files including the new notes.

## DELETE Request

Finally I created a delete request that is called when the client clicks on the trash can next to the notes that are saved on the left hand side of the page. First, the request parses the data from the db file. Then, the request creates an id variable using the id in the request parameter and generates a noteIndex that finds the index in the parsed Notes with the same id. Once the id that matches is found, the request splices that note out of the parsed notes array. Then it re-writes the db.json file without the deleted note and returns the new parsed notes so the index.js can repopulate the notes on the left side of the page.

## Screen Recording

![GIF demonstrating the functionality of the front-end application, adding and deleting notes, and the back-end server, updating the JSON file with the new or removed notes, running using express.js and deployed using Heroku]()

## Link

See the following for a link to my deployed application: https://salty-depths-00367.herokuapp.com/
