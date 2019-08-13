var mysql_dbc = require('../db/db_con.js')();
var connection = mysql_dbc.init();
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
const multer = require('multer');
const path = require("path");
const serverlog = require('./serverlog.js');
const TRUE = 1;
const FALSE = 0;
const ARTICLE_PER_PAGE = 5;
const IS_QUESTION = 0;
const STANDARD_VOTE = 1;
let storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "upload/")
  },
  filename: function(req, file, callback) {
    callback(null, new Date().valueOf() + path.extname(file.originalname));
  }
});
const upload = multer({
  storage
});

const initializeEndpoints = (app) => {
  /**
   * @swagger
   *  /articles:
   *    get:
   *      tags:
   *      - article
   *      description: 모든 글을 받아옴.
   *      parameters:
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/articles', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
        var sql = "SELECT * FROM article";
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
            res.json(rows);
          } else {
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
            res.send(err);
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /articles/questions:
   *    get:
   *      tags:
   *      - article
   *      description: 질문 형식의 글을 모두 받아옴.
   *      parameters:
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/articles/questions', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
        var sql =
        `
        SELECT  *
        FROM    ARTICLE
        WHERE   TOPIC   = 1
        AND     ARTICLE = 0
        AND     IS_REMOVED = 0
        `;
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
            res.json(rows);
          } else {
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
            res.send(err);
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /articles/questions/{user_id}/{page}:
   *    get:
   *      tags:
   *      - article
   *      description: 프로필화면에서 유저가 작성한 질문글중에서 page위치에 해당하는 질문글들을 보여준다.
   *      parameters:
   *      - name: user_id
   *        in: path
   *        type: integer
   *        description: user의 id값
   *      - name: page
   *        in: path
   *        type: integer
   *        description: 보여줄 위치의 page값
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/articles/questions/:user_id/:page', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
        sql =
        `
        SELECT    COUNT(*) COUNT
        FROM      ARTICLE A
        JOIN      CONTENT C
        ON        A.CONTENT       =   C.PK
        WHERE     A.IS_REMOVED    =   0
        AND       A.ARTICLE       =   0
        AND       A.CREATEDUSER   =   ${req.params.user_id}
        `;
        connection.query(sql, function(err, rows, fields) {
          if(!err){
            const QST_PER_PAGE = 5;
            var totalArticle = rows[0].COUNT;
            var totalPage = parseInt(totalArticle/QST_PER_PAGE);
            if(totalArticle > totalPage * QST_PER_PAGE){
              totalPage++;
            }
            if(totalArticle > 0){
              sql =
              `
              SELECT	A.PK,
                      C.PK,
                      C.TITLE,
                      (
                        SELECT	COUNT(*)
                        FROM 		VIEW
                        WHERE 	ARTICLE = A.PK
                      ) VIEW,
                      IFNULL
                      (
                        (
                          SELECT	SUM(GOOD)
                          FROM 		VOTE
                          WHERE 	ARTICLE = A.PK
                        ), 0
                      ) VOTE
              FROM 		ARTICLE A
              JOIN 		CONTENT C
              ON 		  A.CONTENT       =   C.PK
              WHERE   A.IS_REMOVED    =   0
              AND     A.ARTICLE       =   0
              AND     A.CREATEDUSER   =   ${req.params.user_id}
              LIMIT   ${(req.params.page-1)*QST_PER_PAGE}, ${QST_PER_PAGE}
              `;
              connection.query(sql, function(err, rows, fields) {
                if (!err) {
                  serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
                  res.send({status: "success",data:rows, maxPage:totalPage});
                } else {
                  serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                  res.send({status: "fail"});
                }
              });
            }else{  // 데이터가 없을 때
              serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
              res.send({status: "fail", msg: "do not exist data"});
            }
          }else{
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
            res.send({status: "fail"});
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /articles/answers/{user_id}/{page}:
   *    get:
   *      tags:
   *      - article
   *      description: 프로필화면에서 유저가 작성한 답변글중에서 page위치에 해당하는 답변글들을 보여준다.
   *      parameters:
   *      - name: user_id
   *        in: path
   *        type: integer
   *        description: user의 id값
   *      - name: page
   *        in: path
   *        type: integer
   *        description: 보여줄 위치의 page값
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/articles/answers/:user_id/:page', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
        sql =
        `
        SELECT    COUNT(*) COUNT
        FROM      ARTICLE A
        JOIN      CONTENT C
        ON        A.CONTENT       =   C.PK
        WHERE     A.IS_REMOVED    =   0
        AND       A.ARTICLE       !=   0
        AND       A.CREATEDUSER   =   ${req.params.user_id}
        `;
        connection.query(sql, function(err, rows, fields) {
          if(!err){
            const QST_PER_PAGE = 5;
            var totalArticle = rows[0].COUNT;
            var totalPage = parseInt(totalArticle/QST_PER_PAGE);
            if(totalArticle > totalPage * QST_PER_PAGE){
              totalPage++;
            }
            if(totalArticle > 0){
              sql =
              `
              SELECT	A.PK,
                      C.PK,
                      C.TITLE,
                      (
                        SELECT	COUNT(*)
                        FROM 		VIEW
                        WHERE 	ARTICLE = A.PK
                      ) VIEW,
                      IFNULL
                      (
                        (
                          SELECT	SUM(GOOD)
                          FROM 		VOTE
                          WHERE 	ARTICLE = A.PK
                        ), 0
                      ) VOTE
              FROM 		ARTICLE A
              JOIN 		CONTENT C
              ON 		  A.CONTENT       =   C.PK
              WHERE   A.IS_REMOVED    =   0
              AND     A.ARTICLE       !=   0
              AND     A.CREATEDUSER   =   ${req.params.user_id}
              LIMIT   ${(req.params.page-1)*QST_PER_PAGE}, ${QST_PER_PAGE}
              `;
              connection.query(sql, function(err, rows, fields) {
                if (!err) {
                  serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
                  res.send({status: "success",data:rows, maxPage:totalPage});
                } else {
                  serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                  res.send({status: "fail"});
                }
              });
            }else{  // 데이터가 없을 때
              serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
              res.send({status: "fail", msg: "do not exist data"});
            }
          }else{
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
            res.send({status: "fail"});
          }
        });
      }
    });
  });


  /**
   * @swagger
   *  /articles/answers:
   *    get:
   *      tags:
   *      - article
   *      description: 답변 형식의 글을 모두 받아옴.
   *      parameters:
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/articles/answers', function(req, res) {
    const QA = 1;
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
        var sql = `SELECT * FROM article WHERE topic = ${QA} AND article IS NOT NULL`;
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
            res.json(rows);
          } else {
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
            res.send(err);
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /articles/answers/questions/{id}:
   *    get:
   *      tags:
   *      - article
   *      description: 특정 질문의 답변들을 모두 받아옴.
   *      parameters:
   *      - name: id
   *        in: path
   *        type: integer
   *        description: 질문할 article의 id값 전달.
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/articles/answers/questions/:id', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
        var sql =
          `
          SELECT    *
          FROM      ARTICLE
          WHERE     ARTICLE     =   ${req.params.id}
          AND       IS_REMOVED  =   0
          AND       TOPIC       =   1
        `;
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
            res.send({status: "success",data:rows});
          } else {
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
            res.send({status: "fail"});
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /articles/selections/questions/{id}:
   *    get:
   *      tags:
   *      - article
   *      description: 특정 질문의 채택된 답변을 가져옴.(1)
   *      parameters:
   *      - name: id
   *        in: path
   *        type: integer
   *        description: 질문할 article의 id값 전달.
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/articles/selections/questions/:id', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
        var sql = "SELECT * FROM article WHERE pk = ( SELECT content FROM article WHERE pk = ? )"
        var params = req.params.id;
        connection.query(sql, params, function(err, rows, fields) {
          if (!err) {
            serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
            res.json(rows);
          } else {
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
            res.send(err);
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /articles/{topic}/{page}:
   *    get:
   *      tags:
   *      - article
   *      description: page위치에 해당하는 특정 topic의 article들을 가져옴.
   *      parameters:
   *      - name: topic
   *        in: path
   *        type: integer
   *        description: topic의 id 값
   *      - name: page
   *        in: path
   *        type: integer
   *        description: article들을 가져올 page위치의 값
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/articles/:topic/:page', function(req, res) {
    /*
      topic값을 이용하여 특정 게시판의 총 게시글 수(totalArticle)를 먼저 구한다.
      그리고 totalArticle 값을 이용하여 총 페이지 수(maxPage)값도 구하도록 한다.
    */
    var sql = '';
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
        sql =
          `
        SELECT  COUNT(PK) AS TOTAL_ARTICLE
        FROM    ARTICLE WHERE IS_REMOVED = ${FALSE}
        AND     TOPIC = ${req.params.topic}
      `;
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            var totalArticle = rows[0].TOTAL_ARTICLE;
            //나올 수 있는 총 페이지의 수를 구한다.
            var totalPage = parseInt(totalArticle / ARTICLE_PER_PAGE);
            if (totalArticle > totalPage * ARTICLE_PER_PAGE) {
              totalPage++;
            }
            if(totalPage)
            sql =
              `
            SELECT    B.ROWNUM
                    , B.PK
                    , B.TOPIC
                    , B.TITLE
                    , B.USERNAME
                    , B.CREATED_AT
                    , B.VOTE
                    , B.VIEW
            FROM       (
                      SELECT      ROW_NUMBER() OVER( ORDER BY A.PK DESC ) AS
                                ROWNUM
                              , A.PK
                              , A.TOPIC
                              , C.TITLE
                              ,
                              (
                                SELECT  USERNAME
                                FROM    USER
                                WHERE   PK = A.CREATEDUSER
                              ) AS USERNAME
                              , C.CREATED_AT
                              ,
                              (
                                SELECT     COUNT(ARTICLE)
                                FROM         VIEW
                                WHERE     ARTICLE = A.PK
                              ) AS VIEW
                              ,
                              (
                                SELECT    SUM(GOOD)
                                FROM         VOTE
                                WHERE     ARTICLE = A.PK
                              ) AS VOTE
                      FROM        ARTICLE AS A
                      JOIN         CONTENT AS C
                      ON           A.CONTENT = C.PK
                      WHERE     A.TOPIC = ${req.params.topic}
                      AND         A.IS_REMOVED = ${FALSE}
                      AND       A.IS_ACTIVE = ${FALSE}
                    ) AS B
            LIMIT     ${(req.params.page-1)*ARTICLE_PER_PAGE}, ${ARTICLE_PER_PAGE}
          `;
            connection.query(sql, function(err, rows, fields) {
              if (!err) {
                serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
                res.send({status: "success", data: rows, maxPage:totalPage});
              } else {
                serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                res.send({status: "fail"});
              }
            });
          } else {
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
            res.send(err);
          }
        });
      }
    });
  });




  /**
   * @swagger
   *  /articles/goods/{topic}/{page}:
   *    get:
   *      tags:
   *      - article
   *      description: page위치에 해당하는 특정 topic의 article들을 추천순으로 가져옴 (일정 추천 수 이상)
   *      parameters:
   *      - name: topic
   *        in: path
   *        type: integer
   *        description: topic의 id 값
   *      - name: page
   *        in: path
   *        type: integer
   *        description: article들을 가져올 page위치의 값
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/articles/goods/:topic/:page', function(req, res) {
    var sql = '';
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
        sql = `
                  SELECT 	COUNT(PK) AS TOTAL_ARTICLE
                  FROM 		ARTICLE
                  WHERE 	IS_REMOVED = ${FALSE}
                  AND 		TOPIC = ${req.params.topic}
              `;
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            var totalArticle = rows[0].TOTAL_ARTICLE;
            //나올 수 있는 총 페이지의 수를 구한다.
            var totalPage = totalArticle / ARTICLE_PER_PAGE;
            if (totalArticle > totalPage * ARTICLE_PER_PAGE) {
              totalPage++;
            }
            sql = `
            SELECT 	B.ROWNUM
                  , B.TOPIC
                  , B.PK
                  , B.TITLE
                  , B.CREATEDUSER
                  , B.CREATED_AT
                  ,	B.VIEW
                  , B.VOTE
            FROM 	(
                    SELECT 	ROW_NUMBER() OVER( ORDER BY A.PK DESC ) AS
                            ROWNUM
                          , A.TOPIC
                          , A.PK
                          , C.TITLE
                          , C.CREATEDUSER
                          , C.CREATED_AT
                          , (
                               SELECT 	COUNT(ARTICLE)
                               FROM 		VIEW
                               WHERE 	ARTICLE = A.PK
                            )  AS VIEW
                          , (
                               SELECT 	SUM(GOOD)
                               FROM 		VOTE
                               WHERE 	ARTICLE = A.PK
                            )  AS VOTE
                    FROM 		ARTICLE AS A
                    JOIN 		CONTENT AS C
                    ON 	  	A.CONTENT = C.PK
                    WHERE		A.TOPIC = ${req.params.topic}
                    AND 	  A.IS_REMOVED = ${FALSE}
                  ) AS B
            WHERE   B.VOTE >= ${STANDARD_VOTE}
            LIMIT   ${(req.params.page-1)*ARTICLE_PER_PAGE}, ${ARTICLE_PER_PAGE}
                    `;
            connection.query(sql, function(err, rows, fields) {
              if (!err) {
                serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
                res.json(rows);
              } else {
                serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                res.send(err);
              }
            });
          } else {
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
            res.send(err);
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /articles/news/{topic}/{limit}:
   *    get:
   *      tags:
   *      - article
   *      description: 특정 토픽의 최신 article들을 limit개 가져온다.
   *      parameters:
   *      - name: topic
   *        in: path
   *        type: integer
   *        description: 특정 topic의 id 값 (질문일 경우 1 입력)
   *      - name: limit
   *        in: path
   *        type: integer
   *        description: 최신 article들을 받아올 갯수
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/articles/news/:topic/:limit', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
        sql = `SELECT ROW_NUMBER() OVER( ORDER BY A.PK DESC ) AS ROWNUM, A.TOPIC, C.TITLE, A.CREATEDUSER FROM ARTICLE AS A JOIN CONTENT AS C ON A.CONTENT = C.PK WHERE A.IS_REMOVED = ${FALSE} AND A.TOPIC = ${req.params.topic} LIMIT ${req.params.limit}`;
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
            res.json(rows);
          } else {
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
            res.send(err);
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /articles/{id}:
   *    put:
   *      tags:
   *      - article
   *      description: 특정글의 정보를 수정함.
   *      parameters:
   *      - name: id
   *        in: path
   *        type: integer
   *        description: 수정할 article의 id값 전달.
   *      - name: content_id
   *        in: query
   *        type: integer
   *        description: 채택할 또는 채택을 변경할 content의 id값을 전달.
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.put('/articles/:id', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
        var sql = "UPDATE article SET content = ? WHERE pk = ?";
        var params = [req.query.content_id, req.params.id];
        connection.query(sql, params, function(err, rows, fields) {
          if (!err) {
            serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
            res.json(rows);
          } else {
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
            res.send(err);
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /articles/{id}:
   *    delete:
   *      tags:
   *      - article
   *      description: 특정글을 삭제함(flag처리)
   *      parameters:
   *      - name: id
   *        in: path
   *        type: integer
   *        description: 삭제할 article의 id값 전달.
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.delete('/articles/:id', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
        var sql = `UPDATE article SET is_removed = ${TRUE} WHERE pk = ?`;
        var params = req.params.id;
        connection.query(sql, params, function(err, rows, fields) {
          if (!err) {
            serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
            res.json(rows);
          } else {
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
            res.send(err);
          }
        });
      }
    });
  });
  /**
   * @swagger
   *  /questions/all:
   *    get:
   *      tags:
   *      - article
   *      description: 질문게시판의 모든 질문글을 페이징해서 보여줌
   *      parameters:
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/questions/all', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
            sql = ` SELECT
                        ASK.PK
                        ,CON.TITLE
                        ,CON.BODY
                        ,ASK.CREATED_AT AS ASKED_TIME
                        ,ANSWER.CREATED_AT AS ANSERD_TIME
                        ,IFNULL((SELECT
                            GROUP_CONCAT(T.TITLE SEPARATOR ", ")
                          FROM
                            HASHTAG AS H
                              LEFT OUTER JOIN TAG AS T ON H.HASHTAG = T.PK
                          WHERE
                            CON.PK = H.CONTENT),'') AS HASHTAG
                        ,(SELECT
                            COUNT(*)
                          FROM
                            VIEW AS V
                          WHERE
                            ASK.PK = V.ARTICLE) AS VIEWS
                        ,IFNULL((SELECT
                            SUM(V.GOOD)
                          FROM VOTE AS V
                          WHERE ASK.PK = V.ARTICLE),0) AS HELPFUL
                        ,U.PK AS ANSWER_USERPK
                        ,U.USERNAME AS ANSWER_USERNAME
                        ,(SELECT
                            COUNT(*)
                          FROM
                            ARTICLE AS A
                          WHERE
                            A.ARTICLE != 0
                            AND A.CREATEDUSER = U.PK
                            AND A.IS_ACTIVE = 1) AS SELECTED_ANSWER
                        , (SELECT
                            COUNT(*)
                          FROM
                            ARTICLE AS A
                          WHERE
                            A.ARTICLE != 0
                            AND A.CREATEDUSER = U.PK) AS ANSWER
                        , ((SELECT
                            COUNT(*)
                          FROM
                            ARTICLE AS A
                          WHERE
                            A.ARTICLE != 0
                            AND A.CREATEDUSER = U.PK
                            AND A.IS_ACTIVE = 1)/(SELECT
                            COUNT(*)
                          FROM
                            ARTICLE AS A
                          WHERE
                            A.ARTICLE != 0
                            AND A.CREATEDUSER = U.PK)) AS RELIABLE
                    FROM
                      ARTICLE AS ASK
                          LEFT OUTER JOIN CONTENT AS CON ON ASK.CONTENT = CON.PK
                            LEFT OUTER JOIN ARTICLE AS ANSWER ON ASK.ANSWER = ANSWER.PK
                              LEFT OUTER JOIN USER AS U ON ANSWER.CREATEDUSER = U.PK
                    WHERE 1=1
                      AND CON.IS_REMOVED = 0
                      AND ASK.ARTICLE = 0
                        AND ASK.TOPIC = 1
                     `;
            connection.query(sql, function(err, rows, fields) {
              if (!err) {
                serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
                res.json({
                  status: "success",
                  data: rows
                });
              } else {
                serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                res.send({
                  status: "fail",
                  data: err
                });
              }
            });
      }
    });
  });

  /**
   * @swagger
   *  /questions/all/{now_page}:
   *    get:
   *      tags:
   *      - article
   *      description: 질문게시판의 모든 질문글을 페이징해서 보여줌
   *      parameters:
   *      - name: now_page
   *        in: path
   *        type: integer
   *        description: 요청하는 페이지 값을 전달.
   *      - name: order_by
   *        in: query
   *        type: string
   *        description: 정렬할 기준을 전달.<br> PK, VIEWS, HELPFUL, USER_ANSWER, RELIABLE
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/questions/all/:now_page', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
        var perpage = 20;
        var nowpage = req.params.now_page;
        var sql = `  SELECT
                        COUNT(*) AS TOTAL
                      FROM
                        ARTICLE
                      WHERE 1=1
                          AND TOPIC = 1
                          AND ARTICLE = 0
                          AND IS_REMOVED =0 `
        connection.query(sql, function(err, rows2, fields) {
          if (!err) {
            var max_page = parseInt(rows2[0].TOTAL / perpage) + 1;
            if (nowpage > max_page) {
              nowpage = max_page;
            }
            var page = (nowpage - 1) * perpage;
            sql = ` SELECT
                        ASK.PK
                        ,CON.TITLE
                        ,CON.BODY
                        ,ASK.CREATED_AT AS ASKED_TIME
                        ,ANSWER.CREATED_AT AS ANSERD_TIME
                        ,IFNULL((SELECT
                            GROUP_CONCAT(T.TITLE SEPARATOR ", ")
                          FROM
                            HASHTAG AS H
                              LEFT OUTER JOIN TAG AS T ON H.HASHTAG = T.PK
                          WHERE
                            CON.PK = H.CONTENT),'') AS HASHTAG
                        ,(SELECT
                            COUNT(*)
                          FROM
                            VIEW AS V
                          WHERE
                            ASK.PK = V.ARTICLE) AS VIEWS
                        ,IFNULL((SELECT
                            SUM(V.GOOD)
                          FROM VOTE AS V
                          WHERE ASK.PK = V.ARTICLE),0) AS HELPFUL
                        ,U.PK AS ANSWER_USERPK
                        ,U.USERNAME AS ANSWER_USERNAME
                        ,(SELECT
                            COUNT(*)
                          FROM
                            ARTICLE AS A
                          WHERE
                            A.ARTICLE != 0
                            AND A.CREATEDUSER = U.PK
                            AND A.IS_ACTIVE = 1) AS SELECTED_ANSWER
                        , (SELECT
                            COUNT(*)
                          FROM
                            ARTICLE AS A
                          WHERE
                            A.ARTICLE != 0
                            AND A.CREATEDUSER = U.PK) AS USER_ANSWER
                        , ((SELECT
                            COUNT(*)
                          FROM
                            ARTICLE AS A
                          WHERE
                            A.ARTICLE != 0
                            AND A.CREATEDUSER = U.PK
                            AND A.IS_ACTIVE = 1)/(SELECT
                            COUNT(*)
                          FROM
                            ARTICLE AS A
                          WHERE
                            A.ARTICLE != 0
                            AND A.CREATEDUSER = U.PK)) AS RELIABLE
                    FROM
                      ARTICLE AS ASK
                          LEFT OUTER JOIN CONTENT AS CON ON ASK.CONTENT = CON.PK
                            LEFT OUTER JOIN ARTICLE AS ANSWER ON ASK.ANSWER = ANSWER.PK
                              LEFT OUTER JOIN USER AS U ON ANSWER.CREATEDUSER = U.PK
                    WHERE 1=1
                      AND CON.IS_REMOVED = 0
                      AND ASK.ARTICLE = 0
                        AND ASK.TOPIC = 1
                    ORDER BY ${req.query.order_by} DESC
                    LIMIT ${page}, ${perpage} `;
            connection.query(sql, function(err, rows, fields) {
              if (!err) {
                serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
                res.json({
                  status: "success",
                  nowpage: nowpage,
                  max_page: parseInt(max_page),
                  data: rows
                });
              } else {
                serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                res.send({
                  status: "fail",
                  data: err
                });
              }
            });
          } else {
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
            res.send({
              status: "fail",
              data: err
            });
          }
        });



      }
    });
  });

  /**
   * @swagger
   *  /questions/detail/{pk}:
   *    get:
   *      tags:
   *      - article
   *      description: 모든 글을 받아옴.
   *      parameters:
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      - name: pk
   *        in: path
   *        type: integer
   *        description: 게시글의 pk 전달
   *      responses:
   *        200:
   */
  app.get('/questions/detail/:pk', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, 0, this.sql, "fail", req.connection.remoteAddress);
      } else {
        var json = {};
        var sql = `SELECT
                          A.PK
                          ,(SELECT
                            C.VERSION
                          FROM
                            CONTENT AS C
                          WHERE
                            A.CONTENT = C.PK
                          ) AS VERSION
                          ,(SELECT
                                U.USERNAME
                              FROM
                                USER AS U
                              WHERE
                                U.PK = A.CREATEDUSER
                            ) AS USER_NAME
                          ,(SELECT
                              COUNT(*)
                            FROM
                              ARTICLE AS B
                            WHERE
                              B.ARTICLE = A.PK
                          ) AS ANSWERS
                          ,A.ANSWER AS SELECTED
                          ,(SELECT
                                  IFNULL(SUM(V.GOOD),0)
                                FROM VOTE AS V
                                WHERE A.PK = V.ARTICLE) AS HELPFUL
                          ,(SELECT
                            COUNT(*)
                          FROM
                            VIEW AS V
                          WHERE
                            A.PK = V.ARTICLE) AS VIEWS
                          ,(SELECT
                              COUNT(*)
                            FROM
                              WARD AS W
                            WHERE
                              1=1
                              AND W.ARTICLE = A.PK
                              AND W.IS_REMOVED = 0
                          ) AS WARDS
                          ,A.ARTICLE AS IS_ANSWER
                          ,A.IS_ACTIVE
                        FROM
                          ARTICLE AS A
                        WHERE
                          1=1
                    AND A.PK = ${req.params.pk} `;
        connection.query(sql, function(err, question, fields) {
          if (!err) {
            json.QUESTION = question;
            sql = `SELECT
                          C.PK
                          ,C.VERSION
                          ,C.TITLE
                          ,C.BODY
                          ,C.CREATEDUSER AS USER_PK
                          ,(SELECT
                              U.USERNAME
                            FROM
                              USER AS U
                            WHERE
                              U.PK = C.CREATEDUSER
                          ) AS USER_NAME
                          ,CREATED_AT
                      FROM
                          CONTENT AS C
                      WHERE
                          1=1
                          AND C.ARTICLE = ${req.params.pk}
                          AND C.IS_REMOVED = 0
                      `
            connection.query(sql, function(err, versions, fields) {
              if (!err) {
                json.VERSION = versions;
                sql = `SELECT
                          PK
                        FROM
                          ARTICLE
                        WHERE
                          ARTICLE = ${req.params.pk}`;
                connection.query(sql, function(err, answers, fields) {
                  if (!err) {
                    json.ANSWERS = answers;
                    sql = `
                          SELECT
                          COUNT(*) AS CHECKk
                        FROM
                          VIEW
                        WHERE
                          ARTICLE = ${req.params.pk}
                          AND USER = ${decoded.pk}
                          `;

                    connection.query(sql, function(err, checking, fields) {
                      if (!err) {
                        if (checking[0].CHECKk == 0) {
                          sql = `
                        INSERT INTO
                        VIEW (ARTICLE, USER)
                        VALUES (${req.params.pk},${decoded.pk})
                        `;
                          connection.query(sql, function(err, answers, fields) {
                            if (!err) {
                              serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
                              res.send({
                                status: "success",
                                data: json
                              });
                            } else {
                              serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                              res.send({
                                status: "fail",
                                data: err
                              });
                            }
                          });
                        } else {
                          serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
                          res.send({
                            status: "success",
                            data: json
                          });
                        }
                      } else {
                        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                        res.send({
                          status: "fail",
                          data: err
                        });
                      }
                    });


                  } else {
                    serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                    res.send({
                      status: "fail",
                      data: err
                    });
                  }
                });
              } else {
                serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                res.send({
                  status: "fail",
                  data: err
                });
              }
            });
          } else {
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
            res.send({
              status: "fail",
              data: err
            });
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /articles/new:
   *    get:
   *      tags:
   *      - article
   *      description: 모든 글을 받아옴.
   *      parameters:
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/articles/new', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
        var sql = `SELECT
                      A.PK
                      ,C.TITLE
                      ,(SELECT
                          U.USERNAME
                        FROM
                          USER AS U
                        WHERE
                          U.PK = A.CREATEDUSER
                      ) AS WRITER
                      ,(SELECT
                          T.TOPIC
                        FROM
                          TOPIC AS T
                        WHERE
                          T.PK = A.TOPIC
                      ) AS TOPIC
                      ,(SELECT
                          COUNT(*)
                        FROM
                          COMMENT AS CM
                            LEFT OUTER JOIN CONTENT AS CC ON CM.CONTENT = CC.PK
                        WHERE
                          A.PK = CC.ARTICLE
                      ) AS COMMENTS
                    FROM
                      ARTICLE AS A
                        LEFT OUTER JOIN CONTENT AS C ON A.CONTENT = C.PK
                    WHERE
                      1=1
                      AND A.TOPIC NOT IN (1,2)
                    ORDER BY PK DESC
                    LIMIT 0,10`;
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
            res.json(rows);
          } else {
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
            res.send({
              status: "fail",
              data: err
            });
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /questions/search:
   *    get:
   *      tags:
   *      - article
   *      description: 질문 게시판의 검색 결과를 보여준다.
   *      parameters:
   *      - name: search_text
   *        in: query
   *        type: string
   *        description: 검색 문장을 전달
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/questions/search', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
        var sql = ` SELECT
                          *
                    FROM
                        (SELECT
                            ASK.PK
                            ,CON.TITLE
                            ,CON.BODY
                            ,ASK.CREATED_AT AS ASKED_TIME
                            ,ANSWER.CREATED_AT AS ANSERD_TIME
                            ,(SELECT
                                GROUP_CONCAT(T.TITLE SEPARATOR ", ")
                              FROM
                                HASHTAG AS H
                                  LEFT OUTER JOIN TAG AS T ON H.HASHTAG = T.PK
                              WHERE
                                CON.PK = H.CONTENT) AS HASHTAG
                            ,(SELECT
                                COUNT(*)
                              FROM
                                VIEW AS V
                              WHERE
                                ASK.PK = V.ARTICLE) AS VIEWS
                            ,(SELECT
                                SUM(V.GOOD)
                              FROM VOTE AS V
                              WHERE ASK.PK = V.ARTICLE) AS HELPFUL
                            ,U.PK AS ANSWER_USERPK
                            ,U.USERNAME AS ANSWER_USERNAME
                            ,(SELECT
                                COUNT(*)
                              FROM
                                ARTICLE AS A
                              WHERE
                                A.ARTICLE != 0
                                AND A.CREATEDUSER = U.PK
                                AND A.IS_ACTIVE = 1) AS USER_SELECTED_ANSWER
                            , (SELECT
                                COUNT(*)
                              FROM
                                ARTICLE AS A
                              WHERE
                                A.ARTICLE != 0
                                AND A.CREATEDUSER = U.PK) AS USER_ANSWER
                            , ((SELECT
                                COUNT(*)
                              FROM
                                ARTICLE AS A
                              WHERE
                                A.ARTICLE != 0
                                AND A.CREATEDUSER = U.PK
                                AND A.IS_ACTIVE = 1)/(SELECT
                                COUNT(*)
                              FROM
                                ARTICLE AS A
                              WHERE
                                A.ARTICLE != 0
                                AND A.CREATEDUSER = U.PK)) AS RELIABLE
                        FROM
                          ARTICLE AS ASK
                              LEFT OUTER JOIN CONTENT AS CON ON ASK.CONTENT = CON.PK
                                LEFT OUTER JOIN ARTICLE AS ANSWER ON ASK.ANSWER = ANSWER.PK
                                  LEFT OUTER JOIN USER AS U ON ANSWER.CREATEDUSER = U.PK
                        WHERE 1=1
                          AND CON.IS_REMOVED = 0
                          AND ASK.ARTICLE = 0
                            AND ASK.TOPIC = 1
                        ORDER BY HELPFUL DESC) AS TAB
                    WHERE
                      1=1
                      `;

        function replaceAll(str, searchStr, replaceStr) {
          return  str.split(searchStr).join(replaceStr);
        }
        var str = "";
        if(req.query.search_text){
          str = req.query.search_text;
        }
        str = replaceAll(str, '[', '金範賢[');
        str = replaceAll(str, ']', ']金範賢');
        var arr = str.split('金範賢');
        var tag = [];
        var nottag = [];
        for (var i in arr) {
          arr[i] = replaceAll(arr[i], '金範賢', '');
          if (arr[i].charAt(0) == '') continue;
          if (arr[i].charAt(0) == '[') {
            tag.push(arr[i].replace('[', '').replace(']', ''));
          } else {
            nottag.push(arr[i].replace('金範賢', ''));
          }
        }
        for (var i in tag) {
          sql += ` AND TAB.HASHTAG LIKE '${tag[i]}' `
        }
        for (var i in nottag) {
          sql += ` AND ((TAB.TITLE LIKE '%${nottag[i]}%') OR (TAB.BODY LIKE '%${nottag[i]}%')) `
        }
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            sql = `select count(*) as total from article where topic = 1`
            connection.query(sql, function(err, rows2, fields) {
              if (!err) {
                serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
                res.json({
                  status: "success",
                  data: rows
                });
              } else {
                serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                res.send({
                  status: "fail",
                  data: err
                });
              }
            });
          } else {
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
            res.send({
              status: "fail",
              data: err
            });
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /questions/search/{now_page}:
   *    get:
   *      tags:
   *      - article
   *      description: 질문 게시판의 검색 결과를 보여준다.
   *      parameters:
   *      - name: search_text
   *        in: query
   *        type: string
   *        description: 검색 문장을 전달
   *      - name: now_page
   *        in: path
   *        type: string
   *      - name: order_by
   *        in: query
   *        type: string
   *        description: 정렬할 기준을 전달.<br> PK, VIEWS, HELPFUL, USER_ANSWER, RELIABLE
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/questions/search/:now_page', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
        var sql = ` SELECT
                          COUNT(*) AS TOTAL
                    FROM
                        (SELECT
                            ASK.PK
                            ,CON.TITLE
                            ,CON.BODY
                            ,ASK.CREATED_AT AS ASKED_TIME
                            ,ANSWER.CREATED_AT AS ANSERD_TIME
                            ,(SELECT
                                GROUP_CONCAT(T.TITLE SEPARATOR ", ")
                              FROM
                                HASHTAG AS H
                                  LEFT OUTER JOIN TAG AS T ON H.HASHTAG = T.PK
                              WHERE
                                CON.PK = H.CONTENT) AS HASHTAG
                            ,(SELECT
                                COUNT(*)
                              FROM
                                VIEW AS V
                              WHERE
                                ASK.PK = V.ARTICLE) AS VIEWS
                            ,(SELECT
                                SUM(V.GOOD)
                              FROM VOTE AS V
                              WHERE ASK.PK = V.ARTICLE) AS HELPFUL
                            ,U.PK AS ANSWER_USERPK
                            ,U.USERNAME AS ANSWER_USERNAME
                            ,(SELECT
                                COUNT(*)
                              FROM
                                ARTICLE AS A
                              WHERE
                                A.ARTICLE != 0
                                AND A.CREATEDUSER = U.PK
                                AND A.IS_ACTIVE = 1) AS USER_SELECTED_ANSWER
                            , (SELECT
                                COUNT(*)
                              FROM
                                ARTICLE AS A
                              WHERE
                                A.ARTICLE != 0
                                AND A.CREATEDUSER = U.PK) AS USER_ANSWER
                            , ((SELECT
                                COUNT(*)
                              FROM
                                ARTICLE AS A
                              WHERE
                                A.ARTICLE != 0
                                AND A.CREATEDUSER = U.PK
                                AND A.IS_ACTIVE = 1)/(SELECT
                                COUNT(*)
                              FROM
                                ARTICLE AS A
                              WHERE
                                A.ARTICLE != 0
                                AND A.CREATEDUSER = U.PK)) AS RELIABLE
                        FROM
                          ARTICLE AS ASK
                              LEFT OUTER JOIN CONTENT AS CON ON ASK.CONTENT = CON.PK
                                LEFT OUTER JOIN ARTICLE AS ANSWER ON ASK.ANSWER = ANSWER.PK
                                  LEFT OUTER JOIN USER AS U ON ANSWER.CREATEDUSER = U.PK
                        WHERE 1=1
                          AND CON.IS_REMOVED = 0
                          AND ASK.ARTICLE = 0
                            AND ASK.TOPIC = 1
                        ORDER BY HELPFUL DESC) AS TAB
                    WHERE
                      1=1
                      `;

        function replaceAll(str, searchStr, replaceStr) {
          return str.split(searchStr).join(replaceStr);
        }
        var str = "";
        if(req.query.search_text){
          str = req.query.search_text;
        }
        str = replaceAll(str, '[', '金範賢[');
        str = replaceAll(str, ']', ']金範賢');
        var arr = str.split('金範賢');
        var tag = [];
        var nottag = [];
        for (var i in arr) {
          arr[i] = replaceAll(arr[i], '金範賢', '');
          if (arr[i].charAt(0) == '') continue;
          if (arr[i].charAt(0) == '[') {
            tag.push(arr[i].replace('[', '').replace(']', ''));
          } else {
            nottag.push(arr[i].replace('金範賢', ''));
          }
        }
        for (var i in tag) {
          sql += ` AND TAB.HASHTAG LIKE '%${tag[i]}%' `
        }
        for (var i in nottag) {
          sql += ` AND ((TAB.TITLE LIKE '%${nottag[i]}%') OR (TAB.BODY LIKE '%${nottag[i]}%')) `
        }
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            if(rows[0].CHECKING == 0){
              serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
              res.send({
                status: "fail",
                data: "no data"
              });
            }else{
              var perpage = 20;
            var nowpage = req.params.now_page;
            var max_page = parseInt(rows[0].TOTAL / perpage) + 1;
            if (nowpage > max_page) {
              serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
              res.send({
                status: "fail",
                data: "nowpage > maxpage"
              });
            }
            else{
              var page = (nowpage - 1) * perpage;
              var json= {};
              json.nowpage = nowpage;
              json.max_page = max_page;
              sql =
                    `
                    SELECT
                            *
                      FROM
                          (SELECT
                              ASK.PK
                              ,CON.TITLE
                              ,CON.BODY
                              ,ASK.CREATED_AT AS ASKED_TIME
                              ,(SELECT
                                COUNT(*)
                              FROM
                                ARTICLE AS B
                              WHERE
                                ASK.PK = B.ARTICLE
                              ) AS ANSWERS
                              ,ANSWER.CREATED_AT AS ANSERD_TIME
                              ,(SELECT
                                  GROUP_CONCAT(T.TITLE SEPARATOR ", ")
                                FROM
                                  HASHTAG AS H
                                    LEFT OUTER JOIN TAG AS T ON H.HASHTAG = T.PK
                                WHERE
                                  CON.PK = H.CONTENT) AS HASHTAG
                              ,(SELECT
                                  COUNT(*)
                                FROM
                                  VIEW AS V
                                WHERE
                                  ASK.PK = V.ARTICLE) AS VIEWS
                              ,IFNULL((SELECT
                                  SUM(V.GOOD)
                                FROM VOTE AS V
                                WHERE ASK.PK = V.ARTICLE),0) AS HELPFUL
                              ,U.PK AS ANSWER_USERPK
                              ,U.USERNAME AS ANSWER_USERNAME
                              ,IFNULL((SELECT
                                  COUNT(*)
                                FROM
                                  ARTICLE AS A
                                WHERE
                                  A.ARTICLE != 0
                                  AND A.CREATEDUSER = U.PK
                                  AND A.IS_ACTIVE = 1),0) AS USER_SELECTED_ANSWER
                              , IFNULL((SELECT
                                  COUNT(*)
                                FROM
                                  ARTICLE AS A
                                WHERE
                                  A.ARTICLE != 0
                                  AND A.CREATEDUSER = U.PK),0) AS USER_ANSWER
                              , IFNULL((SELECT
                                COUNT(*)
                              FROM
                                ARTICLE AS A
                              WHERE
                                A.ARTICLE != 0
                                AND A.CREATEDUSER = U.PK
                                AND A.IS_ACTIVE = 1),0) AS RELIABLE
                          FROM
                            ARTICLE AS ASK
                                LEFT OUTER JOIN CONTENT AS CON ON ASK.CONTENT = CON.PK
                                  LEFT OUTER JOIN ARTICLE AS ANSWER ON ASK.ANSWER = ANSWER.PK
                                    LEFT OUTER JOIN USER AS U ON ANSWER.CREATEDUSER = U.PK
                          WHERE 1=1
                            AND CON.IS_REMOVED = 0
                            AND ASK.ARTICLE = 0
                              AND ASK.TOPIC = 1
                               ) AS TAB
                          WHERE
                          1=1
                        `;
                for (var i in tag) {
                  sql +=  ` AND TAB.HASHTAG LIKE '%${tag[i]}%' `;
                }
                for (var i in nottag) {
                  sql +=  ` AND ((TAB.TITLE LIKE '%${nottag[i]}%') OR (TAB.BODY LIKE '%${nottag[i]}%')) `;
                }
                sql +=  `ORDER BY ${req.query.order_by} DESC LIMIT ${page}, ${perpage}`;


              connection.query(sql, function(err, rows2, fields) {
                if (!err) {
                  serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
                  json.SEARCH_TAGS = tag;
                  json.SEARCH_TEXT = nottag;
                  json.data = rows2;
                  json.status = "success";
                  res.send(json);
                } else {
                  serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                  res.send({
                    status: "fail",
                    data: err
                  });
                }
              });
            }
            }


          } else {
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
            res.send({
              status: "fail",
              data: err
            });
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /articles/news:
   *    get:
   *      tags:
   *      - article
   *      description: 모든 게시글 중에서 최신 글 10개를 받아온다.
   *      parameters:
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/articles/news', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
        var sql =
          // topic = 1 은 "질문&답변" 주제
          `
        SELECT    *
        FROM      ARTICLE
        WHERE     IS_REMOVED = ${FALSE}
        AND       TOPIC      != 1
        ORDER By  PK DESC
        LIMIT     10
      `;
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
            res.json({
              status: "success",
              data: rows
            });
          } else {
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
            res.send({
              status: "fail",
              data: err
            });
          }
        });
      }
    });
  });
  /**
   * @swagger
   *  /questions/{questionId}/answers/{answerId}:
   *    put:
   *      tags:
   *      - article
   *      parameters:
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      - name: questionId
   *        in: path
   *        type: integer
   *      - name: answerId
   *        in: path
   *        type: integer
   *      responses:
   *        200:
   */
  app.put('/questions/:questionId/answers/:answerId', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
        var sql =
          `
          SELECT
            A.ANSWER
          FROM
            ARTICLE AS A
          WHERE
            A.PK = ${req.params.questionId}
          `;
        connection.query(sql, function(err, preanswer, fields) {
          if (!err) {
            sql =
                  `
                  UPDATE
                    ARTICLE
                  SET
                    IS_ACTIVE = 0
                  WHERE
                    PK = ${preanswer[0].ANSWER}
                  `;
            connection.query(sql, function(err, rows, fields) {
              if(!err){
                sql =
                      `
                      UPDATE
                        ARTICLE
                      SET
                        ANSWER = ${req.params.answerId}
                      WHERE
                        PK =  ${req.params.questionId}
                      `;
                  connection.query(sql, function(err, rows, fields) {
                    if(!err){
                      sql =
                          `
                          UPDATE
                            ARTICLE
                          SET
                            IS_ACTIVE = 1
                          WHERE
                            PK =  ${req.params.answerId}
                          `;
                          connection.query(sql, function(err, rows, fields) {
                            if(!err){
                              serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
                              res.send({status: "success"});
                            }else{
                              serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                              res.send({status: "fail",data: err});
                            }
                          });
                    }else{
                      serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                      res.send({status: "fail",data: err});
                    }
                  });
              }else{
                serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                res.send({status: "fail",data: err});
              }
            });
          } else {
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
            res.send({status: "fail",data: err});
          }
        });
      }
    });
  });

    /**
   * @swagger
   *  /questions/{questionId}/content/{contentId}:
   *    put:
   *      tags:
   *      - article
   *      parameters:
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      - name: questionId
   *        in: path
   *        type: integer
   *      - name: contentId
   *        in: path
   *        type: integer
   *      responses:
   *        200:
   */
  app.put('/questions/:questionId/content/:contentId', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
        var sql =
          `
          SELECT
            COUNT(*) AS CHECKING
          FROM
            CONTENT AS C
          WHERE
            1=1
            AND C.PK = ${req.params.contentId}
            AND C.ARTICLE = ${req.params.questionId}
          `;
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            if(rows[0].CHECKING == 0){
              serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
              res.send({status: "fail", data: "received the wrong data "});
            }else{
              sql =
                    `
                    UPDATE
                      ARTICLE AS A
                    SET
                      A.CONTENT = ${req.params.contentId}
                    WHERE
                      A.PK = ${req.params.questionId}
                    `;
              connection.query(sql, function(err, rows, fields) {
                if(!err){
                  serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
                  res.send({status: "success"});
                }else{
                  serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                  res.send({status: "fail",data: err});
                }
              });
            }
          } else {
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
            res.send({status: "fail",data: err});
          }
        });
      }
    });
  });

/**
  * @swagger
  *  /articles/searches:
  *    get:
  *      tags:
  *      - article
  *      parameters:
  *      - name: topic_id
  *        in: query
  *        type: integer
  *        description: topic의 id 값
  *      - name: type_id
  *        in: query
  *        type: integer
  *        description: 검색할 키워드 (0 = 제목, 1 = 내용, 2 = 제목+내용)
  *      - name: word
  *        in: query
  *        type: string
  *        description: 검색할 내용 및 문자열
  *      - name: page
  *        in: query
  *        type: integer
  *        description: 나타낼 위치의 값 = page
  *      - name: user_token
  *        in: header
  *        type: string
  *        description: 사용자의 token 값을 전달.
  *      responses:
  *        200:
  */
 app.get('/articles/searches', function(req, res) {
  var i = req.query;
  jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
    if (err) {
      res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
    } else {
      var keyword = '';
      var word = '';
      if(i.word) {
        word = i.word;
      }
      switch(parseInt(i.type_id)){
        case 0:
          //keyword = "AND C.TITLE LIKE '%"+req.params.word+"%'";
          keyword = `AND  C.TITLE LIKE '%${word}%'` ;
          break;
        case 1:
          keyword = `AND  C.BODY  LIKE '%${word}%'` ;
          break;
        case 2:
          keyword = `AND (C.TITLE LIKE '%${word}%' OR C.BODY LIKE '%${word}%')` ;
          break;
      }
      var sql =
      `
      SELECT  COUNT(*) COUNT
      FROM    ARTICLE  A
      JOIN    CONTENT  C
      ON      A.CONTENT     = C.PK
      WHERE   A.IS_REMOVED  = 0
              AND A.TOPIC = ${req.query.topic_id}
      `;
      sql +=keyword;
      connection.query(sql, function(err, rows, fields) {
        if (!err) {
          var totalArticle = rows[0].COUNT;     // 검색 후 나온 article의 갯수
          var totalPage = parseInt(totalArticle / ARTICLE_PER_PAGE);
          if(totalArticle > totalPage * ARTICLE_PER_PAGE){
            totalPage++;  // article이 20개씩 나올 페이지의 갯수
          }
          if(i.page > totalPage){
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
            res.send({status: "fail"});
          }else{
            sql =
            `
            SELECT    ROW_NUMBER() OVER(ORDER BY A.PK DESC) ROWNUM
                    , A.PK AS ARTICLE_PK
                    , C.PK AS CONTENT_PK
                    , C.TITLE
                    , C.BODY
                    , A.CREATEDUSER
                    , (
                      SELECT  USERNAME
                      FROM    USER
                      WHERE   PK = A.CREATEDUSER
                    ) USERNAME
                    , A.CREATED_AT
                    , (
                      SELECT  COUNT(*)
                      FROM    VIEW
                      WHERE   ARTICLE = A.PK
                    ) VIEW
                    , (
                      SELECT  IFNULL(SUM(GOOD),0)
                      FROM    VOTE
                      WHERE   ARTICLE = A.PK
                    ) VOTE
            FROM      ARTICLE AS A
            JOIN      CONTENT AS C
            ON        A.CONTENT = C.PK
            WHERE     A.IS_REMOVED = 0
                      AND A.TOPIC = ${req.query.topic_id}
            `;
            sql+=keyword;
            sql+= `LIMIT ${(i.page-1)*ARTICLE_PER_PAGE}, ${ARTICLE_PER_PAGE}`;
            connection.query(sql, function(err, rows, fields) {
              if (!err) {
                serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
                res.send({status: "success", data: rows, maxPage:totalPage});
              } else {
                serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                res.send({status: "fail",data: err});
              }
            });
          }
        } else {
          serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
          res.send({status: "fail",data: err});
        }
      });
    }
  });
});

  /**
   * @swagger
   *  /articles/notices/topics/{pk}:
   *    get:
   *      tags:
   *      - article
   *      description: 모든 글을 받아옴.
   *      parameters:
   *      - name: pk
   *        in: path
   *        type: integer
   *        description: topic pk
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/articles/notices/topics/:pk', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
        var sql =
                  `
                  SELECT      ROW_NUMBER() OVER( ORDER BY A.PK DESC ) AS
                                ROWNUM
                              , A.PK
                              , A.TOPIC
                              , C.TITLE
                              ,
                              (
                                SELECT  USERNAME
                                FROM    USER
                                WHERE   PK = A.CREATEDUSER
                              ) AS USERNAME
                              , C.CREATED_AT
                              ,
                              (
                                SELECT     COUNT(ARTICLE)
                                FROM         VIEW
                                WHERE     ARTICLE = A.PK
                              ) AS VIEW
                              ,
                              (
                                SELECT    SUM(GOOD)
                                FROM         VOTE
                                WHERE     ARTICLE = A.PK
                              ) AS VOTE
                      FROM        ARTICLE AS A
                      JOIN         CONTENT AS C
                      ON           A.CONTENT = C.PK
                      WHERE     A.TOPIC = ${req.params.pk}
                      AND         A.IS_REMOVED = ${FALSE}
                      AND A.IS_ACTIVE = 1
                  `;
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
            res.send({status:"success",data: rows});
          } else {
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
            res.send({status:"fail"});
          }
        });
      }
    });
  });

    /**
   * @swagger
   *  /articles/notices/pages/{page}:
   *    get:
   *      tags:
   *      - article
   *      description: page위치에 해당하는 특정 topic의 article들을 가져옴.
   *      parameters:
   *      - name: page
   *        in: path
   *        type: integer
   *        description: article들을 가져올 page위치의 값
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/articles/notices/pages/:page', function(req, res) {
    /*
      topic값을 이용하여 특정 게시판의 총 게시글 수(totalArticle)를 먼저 구한다.
      그리고 totalArticle 값을 이용하여 총 페이지 수(maxPage)값도 구하도록 한다.
    */
    var sql = '';
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
        sql =
          `
        SELECT  COUNT(A.PK) AS TOTAL_ARTICLE
        FROM    ARTICLE AS A
                  LEFT OUTER JOIN CONTENT AS C ON A.PK = C.ARTICLE
        WHERE A.IS_REMOVED = ${FALSE}
              AND     A.TOPIC = 2
              AND A.IS_ACTIVE = 1
        `;
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            var totalArticle = rows[0].TOTAL_ARTICLE;
            //나올 수 있는 총 페이지의 수를 구한다.
            var totalPage = parseInt(totalArticle / ARTICLE_PER_PAGE);
            if (totalArticle > totalPage * ARTICLE_PER_PAGE) {
              totalPage++;
            }
            if(totalPage)
            sql =
              `
            SELECT    B.ROWNUM
                    , B.PK
                    , B.TOPIC
                    , B.TITLE
                    , B.USERNAME
                    , B.CREATED_AT
                    , B.VOTE
                    , B.VIEW
            FROM       (
                      SELECT      ROW_NUMBER() OVER( ORDER BY A.PK DESC ) AS
                                ROWNUM
                              , A.PK
                              , A.TOPIC
                              , C.TITLE
                              ,
                              (
                                SELECT  USERNAME
                                FROM    USER
                                WHERE   PK = A.CREATEDUSER
                              ) AS USERNAME
                              , C.CREATED_AT
                              ,
                              (
                                SELECT     COUNT(ARTICLE)
                                FROM         VIEW
                                WHERE     ARTICLE = A.PK
                              ) AS VIEW
                              ,
                              (
                                SELECT    SUM(GOOD)
                                FROM         VOTE
                                WHERE     ARTICLE = A.PK
                              ) AS VOTE
                      FROM        ARTICLE AS A
                      JOIN         CONTENT AS C
                      ON           A.CONTENT = C.PK
                      AND     TOPIC = 2
                      AND         A.IS_REMOVED = ${FALSE}
                      AND       A.IS_ACTIVE = ${TRUE}
                    ) AS B
            LIMIT     ${(req.params.page-1)*ARTICLE_PER_PAGE}, ${ARTICLE_PER_PAGE}
          `;
            connection.query(sql, function(err, rows, fields) {
              if (!err) {
                serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
                res.send({status: "success", data: rows, maxPage:totalPage});
              } else {
                serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                res.send({status: "fail"});
              }
            });
          } else {
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
            res.send(err);
          }
        });
      }
    });
  });

};
module.exports = initializeEndpoints;
