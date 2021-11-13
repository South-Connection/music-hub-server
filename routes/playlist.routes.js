const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Playlist = require('../models/Playlist.model');
const User = require('../models/User.model')

router.post('/playlists', (req, res, next) => {
    const { title, description, songs, owner, guests} = req.body;

    Playlist.create({
        title,
        description,
        songs,
        owner,
        guests
    })
        .then(response => res.json(response))
        .catch(err => res.status(500).json(err));
});


router.get('/playlists', (req, res, next) => {
    Playlist.find()
        // .populate()
        .then(allThePlaylists => res.json(allThePlaylists))
            .catch((err) => res.json(err))
});

router.get('/playlists/:playlistId', (req, res, next)=>{
    const {playlistId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
      }
    
    Playlist.findById(playlistId)
    // .populate('user')
    .then(playlist => res.status(200).json(playlist))
    .catch(err => res.status(500).json(err));
});



module.exports = router;