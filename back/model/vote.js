var mysql_dbc = require('../db/db_con.js')();
var connection = mysql_dbc.init();
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
const TRUE = 1;
const FALSE = 0;
const TAG_PER_PAGE = 12;
const serverlog = require('./serverlog.js');

const initializeEndpoints = (app) => {
  /**
   * @swagger
   *  /votes:
   *    post:
   *      tags:
   *      - vote
   *      description: 해당 article을 추천한다.( 1 or -1)
   *      parameters:
   *      - name: voteInfo
   *        in: body
   *        schema:
   *          type: object
   *          properties:
   *            article_id:
   *              type: integer
   *              description: 추천할 article의 id값
   *            user_id:
   *              type: integer
   *              description: 추천할 작성자의 id값
   *            good:
   *              type: integer
   *              description: 추천(1), 비추천(-1)의 구분 값(only 0 or 1)
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.post('/votes', function(req, res) {
    var i = req.body;
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
        var sql =
        // 투표한 이력이 있는지 확인
        `
          SELECT  COUNT(USER) AS COUNT
          FROM    VOTE
          WHERE   ARTICLE = ${i.article_id}
          AND     USER    = ${i.user_id}
        `;
        connection.query(sql, function(err, rows, fields) {
          if(!err && rows[0].COUNT == 0){
            sql =
            `
              INSERT  INTO
              VOTE    (ARTICLE, USER, GOOD)
              VALUES  (${i.article_id},${i.user_id},${i.good})
            `;
            connection.query(sql, function(err, rows, fields) {
              if(!err){
                serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
                res.send({status: "success"});
              }else{
                serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                res.send({status: "fail"});
              }
            });
          }else{
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
            res.send({status: "fail"});
          }
        });
      }
    });
  });



};
module.exports = initializeEndpoints;
