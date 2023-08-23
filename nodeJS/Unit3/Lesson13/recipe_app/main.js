"use strict";

const express = require("express"),
  app = express(),
  errorController = require("./controllers/errorController"),
  homeController = require("./controllers/homeController"),
  layouts = require("express-ejs-layouts"),


  MongoDB = require("mongodb").MongoClient, //Require the MongoDB module.
  dbURL = "mongodb://localhost:27017",
  dbName = "recipe_db";

MongoDB.connect( //setting up a connection to our local server
  dbURL,
  (error, client) => {
    if (error) throw error;
    let db = client.db(dbName); //Get the recipe_db database from my connection to the mongo db server
    db.collection("contacts")
      .find()
      .toArray((error, data) => { //Find all records in the contacts collection
        if (error) throw error;
        console.log(data); //Print the results to the console.
      });

    db.collection("contacts").insert(
      {
        name: "Freddie Mercury",
        email: "fred@queen.com"
      },
      (error, db) => { //Insert a new contact into teh database
        if (error) throw error;
        console.log(db); //log the resulting error or saved item.
      }
    );
  }
);

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(layouts);
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());
app.use(homeController.logRequestPaths);

app.get("/name", homeController.respondWithName);
app.get("/items/:vegetable", homeController.sendReqParam);

app.post("/", (req, res) => {
  console.log(req.body);
  console.log(req.query);
  res.send("POST Successful!");
});

app.use(errorController.logErrors);
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
