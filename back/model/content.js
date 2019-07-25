var mysql_dbc = require('../db/db_con.js')();
var connection = mysql_dbc.init();
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
const TRUE = 1;

const initializeEndpoints = (app) => {
  /**
   * @swagger
   *  /contents:
   *    post:
   *      tags:
   *      - content
   *      description:
   *      parameters:
   *      - name: hashtagInfo
   *        in: body
   *        schema:
   *          type: object
   *          properties:
   *            content_id:
   *              type: integer
   *              description: content의 id값
   *            tag_id:
   *              type: integer
   *              description: tag의 id값
   *            user_token:
   *              type: string
   *              description: 사용자의 token 정보
   *      responses:
   *        200:
   */
  app.post('/hashtags', function(req, res) {
    var i = req.body;
    jwt.verify(i.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "INSERT INTO hashtag(content,hashtag,createdUser,updatedUser) ( SELECT c.pk,t.pk,c.createdUser,c.createdUser FROM content as c JOIN tag as t WHERE c.pk = ? AND t.pk = ? )";
        var params = [i.content_id, i.tag_id];
        connection.query(sql, params, function(err, rows, fields) {
          if (!err) {
            res.json(rows);
          } else {
            console.log('Error while performing Query.', err);
            res.send(err);
          }
        });
      }
    });
  });





};
module.exports = initializeEndpoints;
