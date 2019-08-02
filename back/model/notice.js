var mysql_dbc = require('../db/db_con.js')();
var connection = mysql_dbc.init();
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
const TRUE = 1;
const FALSE = 0;

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
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
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
            if(rows[0].COUNT == 0){
              sql =
              `
                INSERT  INTO
                WARD    ( ARTICLE, USER )
                VALUES  ( ${req.body.article_id}, ${req.body.user_id})
              `;
            }else{
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
              if (!err){
                res.send({status: "success"});
              }else{
                res.send({status: "fail"});
              }
            });
          } else {
            res.send({status: "fail"});
          }
        });
      }
    });
  });

};
module.exports = initializeEndpoints;
