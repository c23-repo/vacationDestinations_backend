// require and call express to create our server
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const server = express();
server.use(cors());

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

// make our server listen on a port
server.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
// database
const { db } = require("./Database");
const { getUID, getUnsplashPhoto: getPhoto } = require("./Services");

// routes
server.get("/", (req, res) => {
  const { location } = req.query;

  if (!location) return res.send(db);

  const locations = db.filter(
    (dest) => dest.location.toLowerCase() === location.toLowerCase()
  );
  return res.send(locations);
});

server.get("/:location/:name", (req, res) => {
  const { location } = req.params;
  if (!location) {
    return res.status(400).json({ error: "name and location are required" });
  }

  const locations = db.filter(
    (dest) => dest.location.toLowerCase() === location.toLowerCase()
  );
  return res.send(locations);
});

server.post("/", async (req, res) => {
  console.log("Inside POST/");
  const { name, location, description } = req.body;
  if (!name || !location)
    return res.status(400).json({ error: "name and location are required" });

  const uid = getUID();
  const photo = await getPhoto(name);

  db.push({
    uid,
    name,
    photo,
    location,
    description: description || "",
  });
  let resData = res.send(db);
  console.log(resData);
  return resData;
});

server.put("/", async (req, res) => {
  const { uid } = req.query;

  console.log(`uid: ${uid}`);
  if (!uid || uid.length !== 6)
    return res.status(400).json({ error: "a uid is required" });

  const { name, location, description } = req.body;
  console.log(`description: ${description}`);
  if (!name && !location && !description)
    return res
      .status(400)
      .json({ error: "we need at least on property to update" });

  // go find a destination with the uid from my db
  for (let index = 0; index < db.length; index++) {
    const dest = db[index];
    if (dest.uid === uid) {
      // dest with uid found. update the dest with new info
      dest.description = description ? description : dest.description;
      dest.location = location ? location : dest.location;

      if (name) {
        const photo = await getPhoto(name);
        dest.name = name;
        dest.photo = photo;
      }
      break;
    }
  }

  return res.send({ success: "true" });
});

server.delete("/", (req, res) => {
  const { uid } = req.query;

  console.log(`uid: ${uid}`);
  if (!uid || uid.length !== 6)
    return res.status(400).json({ error: "a uid is required" });

  let found = false;
  for (let index = 0; index < db.length; index++) {
    const dest = db[index];
    if (dest.uid === uid) {
      // dest with uid found. delete the entry
      found = true;
      db.splice(index, 1);
      break;
    }
  }

  if (found) return res.send({ status: "found and deleted" });
});
// CRUD
// Create Read Update Delete
// POST   GET   PUT     DELETE
// GET / => db : READ operation

// POST / : CREATE operation
// expects {name, location, description?}
// before we create a destination in our db, we will get a photo of that destination from Unsplash

// PUT /?uid : UPDATE operation
// expects {name, location, description?}

// DELETE
// need uid to know what to delete
