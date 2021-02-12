if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
require('../db/connection');
const Memes = require('./models/memes');
const bodyParser = require('body-parser')

const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if ('OPTIONS' == req.method) {
       res.sendStatus(200);
    }
    else {
      next();
    }});

app.get('/memes', async (req, res) => {
    const memes = await Memes.find({});
    res.send({ memes });

})

app.post('/memes', async (req, res) => {
    const meme = new Memes({
        name: req.body.name,
        url: req.body.url,
        caption: req.body.caption
    })
    try{
        await meme.save();
        res.redirect('https://martin04-xmeme.netlify.app');
    }catch(error){
        res.send(error)
    }
})

app.get('/memes/:id', async (req, res) => {
    const meme = await Memes.findById(req.params.id);
    res.send({meme});
})

app.get('*', (req, res) => {
    res.status(404).send("Not found");
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})