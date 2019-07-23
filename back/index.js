const express = require('express');
const endpoints = require('./model/user');
const swaggerDoc = require('./swaggerDoc');
const bodyParser = require('body-parser');
const app = express(express);

app.use(bodyParser.json());
endpoints(app);
swaggerDoc(app);

app.use((err,req,res,next) => console.error('There was an error',err));

app.listen(11123,()=>console.log('App started'));
