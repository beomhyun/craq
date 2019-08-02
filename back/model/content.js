var mysql_dbc = require('../db/db_con.js')();
var connection = mysql_dbc.init();
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
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
    var sql = "";
    var filename = "default_profile.png";
    if(req.file){
      // 이미지 파일 첨부가 있을 경우 새 파일명으로 바꿔준다.
      filename = req.file.filename;
      console.log(filename);
    }
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        console.log("request post contents2");
        console.log("beforeContent : " + i.beforeContent);
        if (i.beforeContent == 0) { // 이전에 작성한 content가 없는 최초의 article 작성일 때
          console.log("request post contents3");

          sql = "INSERT INTO content(title,body,image,createdUser,updatedUser) VALUES(?,?,?,?,?)";
          params = [i.title, i.body, filename, i.user_id, i.user_id];
          connection.query(sql, params, function(err, rows, fields) {
            if (!err) {
              var contentId = rows.insertId;
              sql =
                    `
                      INSERT    INTO
                      ARTICLE   ( TOPIC, ARTICLE, CONTENT, CREATEDUSER, UPDATEDUSER )
                      VALUES    ( ${i.topic_id}, ${i.article_id}, ${contentId}, ${i.user_id}, ${i.user_id} )
                    `;
              connection.query(sql, function(err, rows, fields) {
                if (!err) {
                  console.log("rows.insertId = " + rows.insertId);
                  sql = `UPDATE CONTENT SET ARTICLE = ${rows.insertId} WHERE pk = ${contentId}`;
                  connection.query(sql, function(err, rows, fields) {
                    if (!err) {
                      console.log(rows);

                      // 작성한 글이 어느 질문에 대한 답변일 때
                      if( i.topic_id == 1 && i.article_id != 0){ // 질문 글이면서
                        // 질문 글의 작성자를 얻어온다
                        console.log("TRUE");
                        sql =
                              `
                                SELECT    A.CREATEDUSER
                                        , C.TITLE
                                FROM      ARTICLE AS A
                                JOIN      CONTENT AS C
                                ON        A.CONTENT = C.PK
                                WHERE     A.PK = ${i.article_id}
                              `;
                        connection.query(sql, function(err, rows, fields) {
                          console.log(rows[0].CREATEDUSER);
                          console.log(rows[0].TITLE);
                          var created_user = rows[0].CREATEDUSER;
                          var title = rows[0].TITLE;
                          // 질문 작성자에게 답변이 달렸음을 알려주는 알림정보를 추가한다.
                          var msg = `${title} 글에 답변이 달렸습니다`;
                          sql =
                                `
                                  INSERT  INTO
                                  NOTICE  ( USER, TYPE, BODY )
                                  VALUES  ( ${created_user}, 1, "${msg}" )
                                `;
                          connection.query(sql, function(err, rows, fields) {
                            if (!err){
                              res.send({status: "success2"});
                            }else{
                              res.send({status: "fail4"});
                            }
                          });
                        });
                      }
                    } else {
                      console.log('content update err.', err);
                      res.send(err);
                    }
                  });
                } else {
                  res.send({status: "fail2"});
                }
              });
            } else {
              res.send({status: "fail3"});
            }
          });
        }  else { // 이전에 작성한 content가 있고 기존의 article이 존재할 때
          var version = 1;
          var getversion = `SELECT
                              COUNT(*) AS C
                            FROM
                              CONTENT
                            WHERE 1=1
                              AND ARTICLE = ${i.article_id}`;
          connection.query(sql, params, function(err, rows, fields) {
            if(!err) version = rows[0].C +1;
            else res.send({status: "fail"})
          });
          sql = "INSERT INTO content(Article,beforeContent,title,body,image,createdUser,updatedUser,version) VALUES(?,?,?,?,?,?,?,?)";
          params = [i.article_id, i.beforeContent, i.title, i.body, filename, i.user_id, i.user_id,version];
          connection.query(sql, params, function(err, rows, fields) {
            if (!err) {
              // 기존 article의 content 값을 최신 contetn id값으로 변경, updatedUser 수정
              sql =
                    `
                      UPDATE    ARTICLE
                      SET       CONTENT       = ${rows.insertId}
                              , UPDATEDUSER   = ${i.user_id}
                      WHERE     PK            = ${i.article_id}
                    `;

              connection.query(sql, function(err, rows, fields) {
                if (!err){



                  // 작성한 글이 어느 질문에 대한 답변일 때
                  if( i.topic_id == 1 && i.article_id != 0){ // 질문 글이면서
                    // 질문 글의 작성자를 얻어온다
                    console.log("TRUE");
                    sql =
                          `
                            SELECT    A.CREATEDUSER
                                    , C.TITLE
                            FROM      ARTICLE AS A
                            JOIN      CONTENT AS C
                            ON        A.CONTENT = C.PK
                            WHERE     A.PK = ${i.article_id}
                          `;
                    connection.query(sql, function(err, rows, fields) {
                      console.log(rows[0].CREATEDUSER);
                      console.log(rows[0].TITLE);
                      var created_user = rows[0].CREATEDUSER;
                      var title = rows[0].TITLE;
                      // 질문 작성자에게 답변이 달렸음을 알려주는 알림정보를 추가한다.
                      var msg = `${title} 글에 답변이 달렸습니다`;
                      sql =
                            `
                              INSERT  INTO
                              NOTICE  ( USER, TYPE, BODY )
                              VALUES  ( ${created_user}, 1, "${msg}" )
                            `;
                      connection.query(sql, function(err, rows, fields) {
                        if (!err){
                          res.send({status: "success2"});
                        }else{
                          res.send({status: "fail4"});
                        }
                      });
                    });
                  }






                  res.send({status: "success"});
                }else{
                  res.send({status: "fail1"});
                }
              });
            }else{
              res.send({status: "fail1"});
            }
          });

        }
      }
    });
  });

  /**
   * @swagger
   *  /contents/content-image/{pk}:
   *    get:
   *      tags:
   *      - content
   *      description: 해당 content의 이미지를 가져옴.
   *      responses:
   *       200:
   *      parameters:
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달.
   *      - in: path
   *        name: pk
   *        type: integer
   *        description: 사용자 pk 전달
   */
  app.get('/contents/content-image/:pk', function(req, res) {
    jwt.verify(req.headers.user_token,  secretObj.secret, function(err, decoded) {
      if(err) res.status(401).send({error:'invalid token'});
      else{
        var sql = " select count(*) as cheking, image from content where pk = ? ";
        var params = [req.params.pk];
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
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql =
                  `
                    SELECT	TITLE
                    		  , BODY
                    	    , IMAGE
                    	    , (
                      		 	SELECT	USERNAME
                      		 	FROM 		USER
                      		 	WHERE 	PK = C.CREATEDUSER
                      		 ) USERNAME
                      		 , (
                      		 	SELECT 	SUM(GOOD)
                      		 	FROM 		VOTE
                      		 	WHERE 	ARTICLE = ${req.params.id}
                      		 ) VOTE
                      		 , (
                      		 	SELECT 	COUNT(ARTICLE)
                      		 	FROM 		VIEW
                      		 	WHERE 	ARTICLE = ${req.params.id}
                      		 ) VIEW
                           , (
                             SELECT   CREATED_AT
                             FROM     ARTICLE
                             WHERE    PK = ${req.params.id}
                           ) CREATED_AT
                    FROM 		CONTENT C
                    WHERE 	ARTICLE = ${req.params.id}
                    AND 		IS_REMOVED = 0
                  `;
        connection.query(sql, function(err, rows, fields) {
          if (!err){
            res.send({status: "success",data:rows});
            //res.json(rows);
          }else{
            res.send({status: "fail1"});
            //res.send(err);
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
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql =
        `
          SELECT	CM.PARENTCOMMENT
          		  , USER
          	    , (
          	 	    SELECT 	USERNAME
            		 	FROM 		USER
            		 	WHERE 	PK = CM.USER
            		 ) USERNAME
                , CM.BODY
                , CM.CREATED_AT
          FROM 		COMMENT CM
          JOIN 		CONTENT CT
          ON 		  CM.CONTENT = CT.PK
          WHERE		CT.ARTICLE = ${req.params.id}
          AND 		CM.IS_REMOVED = 0
        `;
        connection.query(sql, function(err, rows, fields) {
          if (!err){
            res.send({status: "success",data:rows});
          }else{
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
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "SELECT * FROM comment WHERE pk = ?";
        var params = req.params.id;
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
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "UPDATE comment SET body = ? WHERE pk = ?";
        var params = [req.query.body, req.params.id];
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
