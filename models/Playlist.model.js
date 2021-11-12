const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const playlistSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    songs: [
        {
            title: {
                type: String,
                required: true
            },

            link: {
                type: String,
                required: true
            }

        }
    ],

    guests: [{ type: Schema.Types.ObjectId, ref: "User" }],
    owner: { type: Schema.Types.ObjectId, ref: "User" }
})




module.exports = model('Playlist', playlistSchema);