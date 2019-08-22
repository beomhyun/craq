const express = require('express');
const user = require('./model/user');
const topic = require('./model/topic');
const notice = require('./model/notice');
const content = require('./model/content');
const hashtag = require('./model/hashtag');
const subscribe = require('./model/subscribe');
const tag = require('./model/tag');
const ward = require('./model/ward');
const article = require('./model/article');
const comment = require('./model/comment');
const vote = require('./model/vote');
const manager = require('./model/manager');
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
content(app);
article(app);
tag(app);
hashtag(app);
ward(app);
subscribe(app);
vote(app);
manager(app);
comment(app);
swaggerDoc(app);

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use((err, req, res, next) => console.error('There was an error', err));
// port setup
app.set('port', process.env.PORT || 9000);

//////////////////////////////////////////////
// ---------- creates Server -------------------
module.exports = app;

var server = app.listen(app.get('port'), function() {
	console.log('Express server listening on port' + server.address().port);
});

module.exports = app;


// app.listen(10123, () => console.log('App started'));
