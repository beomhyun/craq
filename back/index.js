const express = require('express');
const user = require('./model/user');
const topic = require('./model/topic');
const notice = require('./model/notice');
const article = require('./model/article');
const comment = require('./model/comment');
const content = require('./model/content');
const hashtag = require('./model/hashtag');
const subscribe = require('./model/subscribe');
const tag = require('./model/tag');
const swaggerDoc = require('./swaggerDoc');
const bodyParser = require('body-parser');
const app = express(express);
var cors = require('cors');
app.use(cors());
app.use(express.static('./image/profile'));
app.use(express.static('./image/contents'));
app.use(bodyParser.json());
user(app);
topic(app);
notice(app);
article(app);
comment(app);
content(app);
hashtag(app);
tag(app);
subscribe(app);
swaggerDoc(app);

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });

app.use((err,req,res,next) => console.error('There was an error',err));

app.listen(11123,()=>console.log('App started'));
