const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Playlist = require('../models/Playlist.model');
const User = require('../models/User.model')

router.post('/playlists', (req, res, next) => {
    const { title, description, songs, guests } = req.body;

    Playlist.create({
        title,
        description,
        songs,
        // guests,
        // owner: req.user._id
    })
        .then(response => res.json(response))
        .catch(err => res.json(err));
});

//Postman check: description is missing
router.get('/playlists', (req, res, next) => {
    Playlist.find()
        // .populate()
        .then(allThePlaylists => res.json(allThePlaylists))
            .catch((err) => res.json(err))
});




module.exports = router;