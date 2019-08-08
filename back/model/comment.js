var mysql_dbc = require('../db/db_con.js')();
var connection = mysql_dbc.init();
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
const serverlog = require('./serverlog.js');
const TRUE = 1;

const initializeEndpoints = (app) => {
  /**
   * @swagger
   *  /comments:
   *    post:
   *      tags:
   *      - comment
   *      description: content에 댓글을 작성함.
   *      parameters:
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달.
   *      - name: commentInfo
   *        in: body
   *        schema:
   *          type: object
   *          properties:
   *            user_id:
   *              type: integer
   *              description: 댓글 작성자의 id 값.
   *            content_id:
   *              type: integer
   *              description: 댓글이 작성될 content의 id 값.
   *            parent_id:
   *              type: integer
   *              description: 대댓글이 작성될 parent comment의 id 값. 없으면 0
   *            body:
   *              type: string
   *              description: 댓글의 내용.
   *      responses:
   *        200:
   */
  app.post('/comments', function(req, res) {
    var i = req.body;
    console.log(i);
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err){
        res.status(401).send({
         error: 'invalid token'
       });
       serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
      }
      else {
        var sql =
        `
        INSERT  INTO
        COMMENT (USER,CONTENT,PARENTCOMMENT,BODY,CREATEDUSER,UPDATEDUSER)
        VALUES  (${i.user_id},${i.content_id},${i.parent_id},'${i.body}',${i.user_id},${i.user_id})
        `;
        connection.query(sql, function(err, rows, fields) {
          var commentId = rows.insertId;  // 방금 생성한 comment의 id값
          if (!err) { // content 작성자에게도 알림이 가도록 한다.
            sql =
            `
            SELECT	A.ARTICLE AS QUESTION_PK
              		 , (
                		 	SELECT 	CONTENT
                		 	FROM 		ARTICLE
                		 	WHERE 	PK = A.ARTICLE
              		 ) QUESTION_CONTENT
              		 , A.PK 		 AS ANSWER_PK
              		 , C.PK 		 AS ANSWER_CONTENT
              		 , C.TITLE
              		 , A.CREATEDUSER
              		 , (
                		 	SELECT	USERNAME
                		 	FROM 		USER
                		 	WHERE 	PK = A.CREATEDUSER
              		 ) USERNAME
            FROM 		ARTICLE A
            JOIN 		CONTENT C
            ON 	  	A.CONTENT = C.PK
            WHERE 	C.PK = 298
            WHERE 	C.PK = ${i.content_id}
            `;
            connection.query(sql, function(err, rows, fields) {
              var msg = rows[0].TITLE+" 에 댓글이 달렸습니다.";
              var qst_pk = rows[0].QUESTION_PK;
              var qst_content = rows[0].QUESTION_CONTENT;
              var ans_pk = rows[0].ANSWER_PK;
              var ans_content = rows[0].ANSWER_CONTENT;
              var info = `{question_pk:${qst_pk}, question_content:${qst_content}, answer_pk:${ans_pk}, answer_content:${ans_content}}`;

              if(!err && i.user_id != rows[0].CREATEDUSER){
                sql =
                `
                INSERT  INTO
                NOTICE  (USER,TYPE,BODY,INFO)
                VALUES  (${rows[0].CREATEDUSER},2,'${msg}',${info})
                `;
                connection.query(sql, function(err, rows, fields) {
                  if (!err){
                    serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
                    res.send({status: "success"});
                  } else{
                    serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
                    res.send({status: "fail", msg: "insert notice err"});
                  }
                });
              }else{
                serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
                res.send({status: "fail", msg: "select content err"});
              }
            });
          } else {
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send({status: "fail", msg: "insert comment err"});
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /comments/users/{id}:
   *    get:
   *      tags:
   *      - comment
   *      description: 특정 user의 댓글들을 전부 받아옴.
   *      parameters:
   *      - name: id
   *        in: path
   *        type: integer
   *        description: user의 id값을 전달
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 토큰 전달
   *      responses:
   *        200:
   */
  app.get('/comments/users/:id', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err){
        res.status(401).send({
         error: 'invalid token'
       });
       serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
      }
      else {
        var sql = "SELECT * FROM comment WHERE User = ?";
        var params = req.params.id;
        connection.query(sql, params, function(err, rows, fields) {
          if (!err) {
            serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
            res.json(rows);
          } else {
            // console.log('Error while performing Query.', err);
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send(err);
          }
        });
      }
    });
  });

/**
  * @swagger
  *  /comments/articles/{id}:
  *    get:
  *      tags:
  *      - comment
  *      description: 특정 atricle의 댓글들을 전부 받아옴.
  *      parameters:
  *      - name: id
  *        in: path
  *        type: integer
  *        description: article의 id
  *      - name: user_token
  *        in: header
  *        type: string
  *        description: 사용자의 토큰 전달
  *      responses:
  *        200:
  */
 app.get('/comments/articles/:id', function(req, res) {
  jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
    if (err) {
      res.status(401).send({
      error: 'invalid token'
    });
    serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
  }
    else {
      var sql =
      `
        SELECT    CM.PARENTCOMMENT
                  , USER
                , (
                     SELECT     USERNAME
                       FROM         USER
                       WHERE     PK = CM.USER
                   ) USERNAME
              , CM.BODY
              , CM.CREATED_AT
        FROM         COMMENT CM
        JOIN         CONTENT CT
        ON           CM.CONTENT = CT.PK
        WHERE        CT.ARTICLE = ${req.params.id}
        AND         CM.IS_REMOVED = 0
      `;
      connection.query(sql, function(err, rows, fields) {
        if (!err){
          serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
          res.send({status: "success",data:rows});
        }else{
          serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
          res.send({status: "fail"});
        }
      });
    }
  });
});


  /**
   * @swagger
   *  /comments/{id}:
   *    get:
   *      tags:
   *      - comment
   *      description: 특정 댓글을 받아옴(1)
   *      parameters:
   *      - name: id
   *        in: path
   *        type: integer
   *        description: 댓글의 id값을 전달
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 토큰 전달
   *      responses:
   *        200:
   */
  app.get('/comments/:id', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
    }
      else {
        var sql = "SELECT * FROM comment WHERE pk = ?";
        var params = req.params.id;
        connection.query(sql, params, function(err, rows, fields) {
          if (!err) {
            serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
            res.json(rows);
          } else {
            // console.log('Error while performing Query.', err);
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send(err);
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /comments/{id}:
   *    put:
   *      tags:
   *      - comment
   *      description: 특정 댓글의 내용을 수정.
   *      parameters:
   *      - name: id
   *        in: path
   *        type: integer
   *        description: 댓글의 id값을 전달
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 토큰 전달
   *      - name: body
   *        in: query
   *        type: string
   *        description: 수정할 댓글 내용
   *      responses:
   *        200:
   */
  app.put('/comments/:id', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
    }
      else {
        var sql = "UPDATE comment SET body = ? WHERE pk = ?";
        var params = [req.query.body, req.params.id];
        connection.query(sql, params, function(err, rows, fields) {
          if (!err) {
            serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
            res.json(rows);
          } else {
            // console.log('Error while performing Query.', err);
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send(err);
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /comments/{id}:
   *    delete:
   *      tags:
   *      - comment
   *      description: 특정 댓글을 삭제(is_removed flag 처리 0->1)
   *      parameters:
   *      - name: id
   *        in: path
   *        type: integer
   *        description: 댓글의 id값을 전달
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 토큰 전달
   *      responses:
   *        200:
   */
  app.delete('/comments/:id', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = `UPDATE comment SET is_removed = ${TRUE} WHERE pk = ?`;
        var params = [req.params.id];
        connection.query(sql, params, function(err, rows, fields) {
          if (!err) {
            serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
            res.json(rows);
          } else {
            // console.log('Error while performing Query.', err);
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send(err);
          }
        });
      }
    });
  });

};
module.exports = initializeEndpoints;
