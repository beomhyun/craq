var mysql_dbc = require('../db/db_con.js')();
var connection = mysql_dbc.init();
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
const TRUE = 1;
const FALSE = 0;
const serverlog = require('./serverlog.js');

const initializeEndpoints = (app) => {
  /**
   * @swagger
   *  /wards:
   *    post:
   *      tags:
   *      - ward
   *      description: 게시글에 와드를 추가한다.
   *      parameters:
   *      - name: wardInfo
   *        in: body
   *        schema:
   *          type: object
   *          properties:
   *            article_id:
   *              type: integer
   *              description: 와드를 추가할 게시글의 id값
   *            user_id:
   *              type: integer
   *              description: 와드를 추가하는 유저의 id값
   *            user_token:
   *              type: string
   *              description: 사용자의 token 정보
   *      responses:
   *        200:
   */
  app.post('/wards', function(req, res) {
    jwt.verify(req.body.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
        // 와드 기록이 있는지 없는지 확인 (=COUNT)
        var sql =
          `
          SELECT  COUNT(ARTICLE) AS COUNT
          FROM    WARD
          WHERE   ARTICLE = ${req.body.article_id}
          AND     USER    = ${req.body.user_id}
        `;
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            if (rows[0].COUNT == 0) {
              sql =
                `
                INSERT  INTO
                WARD    ( ARTICLE, USER )
                VALUES  ( ${req.body.article_id}, ${req.body.user_id})
              `;
            } else {
              // 이전 기록이 있을 때는 is_remove만 반대처리해준다
              sql =
                `
                UPDATE  WARD
                SET     IS_REMOVED = ABS(IS_REMOVED-1)
                WHERE   ARTICLE    = ${req.body.article_id}
                AND     USER       = ${req.body.user_id}
              `;
            }
            connection.query(sql, function(err, rows, fields) {
              if (!err) {
                serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
                res.send({
                  status: "success"
                });
              } else {
                serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                res.send({
                  status: "fail"
                });
              }
            });
          } else {
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
            res.send({
              status: "fail"
            });
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /wards/{article_id}/{user_id}:
   *    get:
   *      tags:
   *      - ward
   *      description: 게시글의 와드 여부를 가져옴 success -> 와드 기록 있음,   fail-> 와드 기록 없음
   *      parameters:
   *      - name: article_id
   *        in: path
   *        type: integer
   *        description: article id 값
   *      - name: user_id
   *        in: path
   *        type: integer
   *        description: user의 id값
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달.
   *      responses:
   *        200:
   */
  app.get('/wards/:article_id/:user_id', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
      } else {
        var sql =
        `
        SELECT  COUNT(ARTICLE) AS COUNT
        FROM    WARD
        WHERE   ARTICLE = ${req.params.article_id}
        AND     USER    = ${req.params.user_id}
        `;
        connection.query(sql, function(err, rows, fields) {
          if (!err && rows[0].COUNT == 1) {
              serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
              res.send({ status: "success" });
          } else {
              serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
              res.send({ status: "fail" });
          }
        });
      }
    });
  });

};
module.exports = initializeEndpoints;
