const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Playlist = require("../models/Playlist.model");
const User = require("../models/User.model");
const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");


router.post("/playlists", isLoggedIn, (req, res, next) => {
  const { title, description, songName, songLink, guests } = req.body;
  Playlist.create({
    title,
    description,
    songs: [{ title: songName, link: songLink }],
    owner: req.session.user,
    guests,
  })
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json(err));
});
//routes for usersfromDb
router.get("/users", (req, res, next) => {
  User.find()
    .then((allUsersFromDb) => res.json(allUsersFromDb))
    .catch((err) => res.json(err));
});

//get all the playlists in the system
router.get("/all-playlists", (req, res, next) => {
  Playlist.find()
    .then((allThePlaylists) => res.json(allThePlaylists))
    .catch((err) => res.json(err));
});

//get all the playlists for the current user (user needs to be owner or guest)
router.get("/playlists", (req, res, next) => {
  
  Playlist.find()
    .then((allThePlaylists) => {
      const myPlaylists = allThePlaylists.filter( (item) => {
        return item.owner.toString() === req.session.user._id || item.guests.includes(req.session.user._id);
      });

      res.json(myPlaylists);
    })
    .catch((err) => res.json(err));
});

//get Playlist Details
router.get("/playlists/:playlistId", (req, res, next) => {
  const { playlistId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Playlist.findById(playlistId)
    // .populate('user')
    .then((playlist) => res.status(200).json(playlist))
    .catch((err) => res.status(500).json(err));
});

//update Playlist
router.put("/playlists/:playlistId", (req, res, next) => {
  const { playlistId } = req.params;
  const newDetails = req.body;

  console.log(newDetails);

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Playlist.findByIdAndUpdate(playlistId, newDetails)
    .then(() =>
      res.json({
        message: `Playlist with ${playlistId} is updated successfully.`,
      })
    )
    .catch((err) => res.status(500).json(err));

});

//delete Playlist
router.delete("/playlists/:playlistId", (req, res, next) => {
  const { playlistId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Playlist.findByIdAndRemove(playlistId)
    .then(() =>
      res.json({
        message: `playlist with ${playlistId} is removed successfully.`,
      })
    )
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
