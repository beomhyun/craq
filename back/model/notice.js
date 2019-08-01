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
<<<<<<< HEAD
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
=======
   *       - name: user_token
   *         in: header
   *         type: string
   *         description: 사용자의 token값을 전달.
   *       - name: noticeInfo
   *         in: body
   *         schema:
   *           $ref: '#/definitions/noticeInfo'
   */
  app.post('/notices', function(req, res) {
    jwt.verify(req.headers.user_token,  secretObj.secret, function(err, decoded) {
      if(err) res.status(401).send({error:'invalid token'});
      else{
        var sql = " insert into notice(User,Type,createdUser,is_active,Body,info) values(?,?,?,0,?,?) ";
        var params = [req.body.User, req.body.Type, req.body.createdUser,req.body.Body,req.body.info];
        connection.query(sql, params, function(err, rows, fields) {
          if (!err) {
            res.json({status: "success"});
          } else {
            console.log('Error while performing Query.', err);
            res.send({status: "fail"});
          }
        });
        
      }
    });
  });

  /**
   * @swagger
   *  /notices/{User}:
   *    get:
   *      tags:
   *      - notice
   *      description: create notice
   *      responses:
   *        200:
   *      parameters:
   *       - name: user_token
   *         in: header
   *         type: string
   *         description: 사용자의 token값을 전달.
   *       - in: path
   *         name: User
   *         type: integer
   *         description: |
   *          사용자 pk 전달   
   */
  app.get('/notices/:User', function(req, res) {
    jwt.verify(req.headers.user_token,  secretObj.secret, function(err, decoded) {
      if(err) res.status(401).send({error:'invalid token'});
      else{
        var sql = " select * from notice where User = ? and is_removed = 0 ";
        var params = [req.params.User];
        connection.query(sql, params, function(err, rows, fields) {
          if (!err) {
            res.json({status: "success", data: rows});
          } else {
            console.log('Error while performing Query.', err);
            res.send({status: "fail"});
          }
        });
        
      }
    });
});

  /**
   * @swagger
   *  /notices/{pk}:
   *    put:
   *      tags:
   *      - notice
   *      description: notice 읽음처리
   *      responses:
   *        200:
   *      parameters:
   *       - name: user_token
   *         in: header
   *         type: string
   *         description: 사용자의 token값을 전달.
   *       - in: path
   *         name: pk
   *         type: integer
   *         description: |
   *          notice pk 전달   
   */
  app.put('/notices/:pk', function(req, res) {
    jwt.verify(req.headers.user_token,  secretObj.secret, function(err, decoded) {
      if(err) res.status(401).send({error:'invalid token'});
      else{
        var sql = " update notice set is_active =1 where pk = ? ";
        var params = [req.params.pk];
        connection.query(sql, params, function(err, rows, fields) {
          if (!err) {
            res.json({status: "success"});
          } else {
            console.log('Error while performing Query.', err);
            res.send({status: "fail"});
          }
        });
        
      }
    });
  });

  /**
   * @swagger
   *  /notices/{pk}:
   *    delete:
   *      tags:
   *      - notice
   *      description: notice 삭제처리
   *      responses:
   *        200:
   *      parameters:
   *       - name: user_token
   *         in: header
   *         type: string
   *         description: 사용자의 token값을 전달.
   *       - in: path
   *         name: pk
   *         type: integer
   *         description: |
   *          notice pk 전달   
   */
  app.delete('/notices/:pk', function(req, res) {
    jwt.verify(req.headers.user_token,  secretObj.secret, function(err, decoded) {
      if(err) res.status(401).send({error:'invalid token'});
      else{
        var sql = " update notice set is_removed =1 where pk = ? ";
        var params = [req.params.pk];
        connection.query(sql, params, function(err, rows, fields) {
          if (!err) {
            res.json({status: "success"});
          } else {
            console.log('Error while performing Query.', err);
            res.send({status: "fail"});
          }
        });
        
>>>>>>> fc6771904bb142ec1c392ea35d2934c048b1bc83
      }
    });
  });

};
module.exports = initializeEndpoints;
