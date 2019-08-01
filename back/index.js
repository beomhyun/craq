const express = require('express');
const user = require('./model/user');
const topic = require('./model/topic');
const notice = require('./model/notice');
<<<<<<< HEAD
const content = require('./model/content');
const article = require('./model/article');
const tag = require('./model/tag');
const ward = require('./model/ward');
=======
const article = require('./model/article');
const comment = require('./model/comment');
const content = require('./model/content');
const hashtag = require('./model/hashtag');
const tag = require('./model/tag');
>>>>>>> fc6771904bb142ec1c392ea35d2934c048b1bc83
const swaggerDoc = require('./swaggerDoc');
const bodyParser = require('body-parser');
const app = express(express);

app.use(express.static('./image/profile'));
app.use(express.static('./image/contents'));
app.use(bodyParser.json());
user(app);
topic(app);
notice(app);
<<<<<<< HEAD
content(app);
article(app);
tag(app);
ward(app);
=======
article(app);
comment(app);
content(app);
hashtag(app);
tag(app);

>>>>>>> fc6771904bb142ec1c392ea35d2934c048b1bc83
swaggerDoc(app);

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use((err, req, res, next) => console.error('There was an error', err));

app.listen(11123, () => console.log('App started'));
