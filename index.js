import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser'
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';
import CodeModel from './models/CodeModel.js';
import UrlModel from './models/UrlModel.js';
import jsonwebtoken from 'jsonwebtoken'
import CONFIG from './config.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 5000;
mongoose.connect('mongodb://127.0.0.1:27017/codes');

app.post('/api/login', async (req, res) => {
    const jwt = req.body.jwt;
    try{
        if(jsonwebtoken.verify(jwt, 'huizalupa123')) res.sendStatus(200);
    } catch {
        res.sendStatus(403);
    }
});

app.post('/api/auth', async (req, res) => {
    if(req.body.user === CONFIG.USER && req.body.pass === CONFIG.PASS){
        res.send({jwt: jsonwebtoken.sign({username: CONFIG.USER}, 'huizalupa123')});
    } else {
        res.sendStatus(403);
    }
});

app.get('/api/code', async (req, res) => {
    res.send(await CodeModel.find());
});

app.post('/api/code', (req, res) => {
    for(let i = 0; i< req.body.amount; i++) {
        new CodeModel({code: uuidv4(), valid: true, date: new Date()}).save();
    }

    res.sendStatus(201);
});

app.post('/api/url', async (req, res) => {
    const url = req.body.url;
    const code = req.body.code;
    const codeObject = await CodeModel.findOne({code: code});
    if(codeObject?.valid) {
        await new UrlModel({url: url, code: code, date: new Date(), ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress }).save();
        await CodeModel.findOneAndUpdate({code: codeObject.code}, {valid: false});
        res.sendStatus(201);
    } else {
        res.statusCode = 400;
        res.send({error: "Code is not valid"});
    }
});

app.get('/api/url', async (req, res) => {
    res.send(await UrlModel.find())
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
