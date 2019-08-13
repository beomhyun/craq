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
             SELECT	IFNULL(QST_PK,-1) 		QST_PK
             		 , IFNULL(QST_CONTENT,-1)  QST_CONTENT
             		 , B.ANS_PK
             		 , B.ANS_CONTENT
             		 , B.CREATEDUSER
             		 , B.TITLE
             FROM(
             		SELECT	(
             					SELECT	PK
             					FROM 		ARTICLE
             					WHERE 	PK = A.ARTICLE
             				 ) QST_PK
             			    , (
             			 		SELECT	CONTENT
             			 		FROM 		ARTICLE
             			 		WHERE 	PK = A.ARTICLE
             			 	 ) QST_CONTENT
             			 	 , A.PK 			AS ANS_PK
             			 	 , A.CONTENT 	AS ANS_CONTENT
             			 	 , A.CREATEDUSER
             			 	 , C.TITLE
             		FROM 		ARTICLE 		AS A
             		JOIN 		CONTENT 		AS C
             		ON 		A.CONTENT = C.PK
             		WHERE 	C.PK = ${i.content_id}
             ) AS B
             `;
            // content_id를 갖는 article의 정보를 가져온다.
            // 가져온 article이 질문일 때는 QST_PK, QST_CONTENT가 -1로 나타남
            connection.query(sql, function(err, rows, fields) {
              var title = rows[0].TITLE.substring(0,10);
              var msg = `"${title}.. " 에 댓글이 달렸습니다`;
              var qst_pk = rows[0].QST_PK;
              if(qst_pk == -1){
                qst_pk = rows[0].ANS_PK;
              }
              var info = `{"question_pk":${qst_pk}, "comment_pk":${commentId}}`;

              if(!err && i.user_id != rows[0].CREATEDUSER){
                sql =
                `
                INSERT  INTO
                NOTICE  (USER,TYPE,BODY,INFO)
                VALUES  (${rows[0].CREATEDUSER},2,'${msg}','${info}')
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
              , CM.PK AS PK
        FROM         COMMENT CM
        JOIN         CONTENT CT
        ON           CM.CONTENT = CT.PK
        WHERE        CT.ARTICLE = ${req.params.id}
        AND         CM.IS_REMOVED = 0
      `;
      connection.query(sql, function(err, rows, fields) {
        console.log(this.sql);
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
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send(err);
          }
        });
      }
    });
  });

};
module.exports = initializeEndpoints;
