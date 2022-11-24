import mongoose from 'mongoose';

const Song = new mongoose.Schema({

    audioFile: { type: Buffer, required: true },
    backgroundImg: { type: Buffer, required: true },
    title: { type: String, required: true, unique: true },
    artist: { type: String, required: true },

}, { collection: 'song-data' });

const model = mongoose.model('SongData', Song);

export default model;