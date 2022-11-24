import express from 'express'; 
import cors from 'cors';
import mongoose, { Connection } from 'mongoose';
import User from './models/user.model'
import Song from './models/song.model'
import jwt from 'jsonwebtoken'
import multer from 'multer';
import path from 'path';
import { GridFSBucket } from 'mongodb';
import Grid from 'gridfs-stream'
import getStream from 'get-stream';

const app = express();

const storage = multer.memoryStorage()
// const upload = multer({ dest: './public/data/uploads/' });
const upload = multer({ storage: storage });

app.use( cors() );
app.use( express.json() )
app.use( express.urlencoded({ extended: true }))
const mongoURI = 'mongodb://localhost:27017/pwa_db';

let gridFSBucket: GridFSBucket;
let connection: Connection;

mongoose.connect(mongoURI);

app.post('/api/addSong', upload.any(), async (req, res) => {
    console.log(req.body);
    const files = req.files as Express.Multer.File[];
    try {
        if(req.files != undefined) {
        
            await Song.create({

                audioFile: files[0].buffer,
                backgroundImg: files[1].buffer,
                title: req.body.title,
                artist: req.body.artist
                
            });

            res.json({ status: 'ok' })

            
        }

    } catch(err) {
        console.log(err)
        res.json({ status: 'error', error: 'Something went wrong' })
    }
 
})

app.post('/api/getFiles',async (req, res) => {
 
    try {
       
        
         const songs = await Song.find();
         
         if(songs) {

            const songToken = jwt.sign({
                songs: songs
            }, 'secret_token_12324456')
           
            return res.json({ status: 'ok', songs: songToken })
         }   
       

    } catch(err) {
        console.log(err)
        res.json({ status: 'error', error: 'Something went wrong' })
    }
 
})


app.post('/api/register', async (req, res) => {
    console.log(req.body)
    try {
        
        await User.create({

            name: req.body.name,
            email: req.body.email,
            password: req.body.password
            
        });

        
        res.json({ status: 'ok' })

    } catch(err) {
        console.log(err)
        res.json({ status: 'error', error: 'Duplicate email' })
    }

    
})

app.post('/api/login', async (req, res) => {
    console.log(req.body)
   
    try {
        
       const user = await User.findOne({
            email: req.body.email,
            password: req.body.password
        });

        if( user ) {

            const token = jwt.sign({
                email: user.email,
                name: user.name,
                password: user.password

            }, 'secret_token_12324456')
            
            return res.json({ status: 'ok', user: token })
            
        } else {
            return res.json({ status: 'error', user: false })
        }

    } catch(err) {
        console.log(err)
        res.json({ status: 'error', error: 'Duplicate email' })
    }

    
})

app.listen(1337, () => {
    console.log("server started on 1337");
})
