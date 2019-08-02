var mysql_dbc = require('../db/db_con.js')();
var connection = mysql_dbc.init();
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
const multer = require('multer');
const path = require("path");
const TRUE = 1;
const FALSE = 0;
const ARTICLE_PER_PAGE = 20;
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
   *        in: query
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/articles', function(req, res) {
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "SELECT * FROM article";
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            res.json(rows);
          } else {
            console.log('article insert err ', err);
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
   *        in: query
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/articles/questions', function(req, res) {
    const QA = 1;
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = `SELECT * FROM article WHERE topic = ${QA} AND article IS NULL`;
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            res.json(rows);
          } else {
            console.log('article insert err ', err);
            res.send(err);
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
   *        in: query
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/articles/answers', function(req, res) {
    const QA = 1;
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = `SELECT * FROM article WHERE topic = ${QA} AND article IS NOT NULL`;
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            res.json(rows);
          } else {
            console.log('article insert err ', err);
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
   *        in: query
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/articles/answers/questions/:id', function(req, res) {
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "SELECT * FROM article WHERE article = ?";
        var params = req.params.id;
        connection.query(sql, params, function(err, rows, fields) {
          if (!err) {
            res.json(rows);
          } else {
            console.log('article insert err ', err);
            res.send(err);
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
   *        in: query
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/articles/selections/questions/:id', function(req, res) {
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "SELECT * FROM article WHERE pk = ( SELECT content FROM article WHERE pk = ?)"
        var params = req.params.id;
        connection.query(sql, params, function(err, rows, fields) {
          if (!err) {
            res.json(rows);
          } else {
            console.log('article insert err ', err);
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
   *        in: query
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
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
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
            var totalPage = totalArticle / ARTICLE_PER_PAGE;
            if (totalArticle > totalPage * ARTICLE_PER_PAGE) {
              totalPage++;
            }
            sql =
            `
              SELECT    B.ROWNUM
                      , B.TOPIC
                      , B.TITLE
                      , B.USERNAME
                      , B.CREATED_AT
              FROM 	  (
                        SELECT	  ROW_NUMBER() OVER( ORDER BY A.PK DESC ) AS
                                  ROWNUM
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
                                  SELECT 	COUNT(ARTICLE)
                                  FROM 		VIEW
                                  WHERE 	ARTICLE = A.PK
                                ) AS VIEW
                                ,
                                (
                                  SELECT	SUM(GOOD)
                                  FROM 		VOTE
                                  WHERE 	ARTICLE = A.PK
                                ) AS VOTE
                        FROM		ARTICLE AS A
                        JOIN 		CONTENT AS C
                        ON 	  	A.CONTENT = C.PK
                        WHERE 	A.TOPIC = ${req.params.topic}
                        AND 		A.IS_REMOVED = ${FALSE}
                      ) AS B
              LIMIT     ${(req.params.page-1)*ARTICLE_PER_PAGE}, ${ARTICLE_PER_PAGE}
            `;
            connection.query(sql, function(err, rows, fields) {
              if (!err) {
                res.json(rows);
              } else {
                console.log('article insert err ', err);
                res.send(err);
              }
            });
          } else {
            console.log('article insert err ', err);
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
   *        in: query
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/articles/goods/:topic/:page', function(req, res) {
    var sql = '';
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        sql = `
                  SELECT 	COUNT(PK) AS TOTAL_ARTICLE
                  FROM 		ARTICLE
                  WHERE 	IS_REMOVED = ${FALSE}
                  AND 		TOPIC = ${req.params.topic}
              `;
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            var totalArticle = rows[0].TOTAL_ARTICLE;
            //console.log("totalArticle = "+totalArticle);
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
                res.json(rows);
              } else {
                console.log('article insert err ', err);
                res.send(err);
              }
            });
          } else {
            console.log('article insert err ', err);
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
   *        in: query
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/articles/news/:topic/:limit', function(req, res) {
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        sql = `SELECT ROW_NUMBER() OVER( ORDER BY A.PK DESC ) AS ROWNUM, A.TOPIC, C.TITLE, A.CREATEDUSER FROM ARTICLE AS A JOIN CONTENT AS C ON A.CONTENT = C.PK WHERE A.IS_REMOVED = ${FALSE} AND A.TOPIC = ${req.params.topic} LIMIT ${req.params.limit}`;
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            res.json(rows);
          } else {
            console.log('article insert err ', err);
            res.send(err);
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
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
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
            res.json({
              status: "success", data: rows
            });
          } else {
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
   *        in: query
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.put('/articles/:id', function(req, res) {
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "UPDATE article SET content = ? WHERE pk = ?";
        var params = [req.query.content_id, req.params.id];
        connection.query(sql, params, function(err, rows, fields) {
          if (!err) {
            res.json(rows);
          } else {
            console.log('article insert err ', err);
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
   *        in: query
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.delete('/articles/:id', function(req, res) {
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = `UPDATE article SET is_removed = ${TRUE} WHERE pk = ?`;
        var params = req.params.id;
        connection.query(sql, params, function(err, rows, fields) {
          if (!err) {
            res.json(rows);
          } else {
            console.log('article insert err ', err);
            res.send(err);
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /questions/{now_page}:
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
   *        description: 정렬할 기준을 전달.<br> VIEWS, HELPFUL, ANSWER, RELIABLE
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/questions/:now_page', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var perpage = 20;
        var page = (req.params.now_page - 1) * perpage;
        // console.log(page);
        var sql = ` SELECT
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
   ORDER BY ${req.query.order_by} DESC
   LIMIT ${page}, ${perpage} `;
        // console.log(sql);
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            sql = `select count(*) as total from article where topic = 1`
            connection.query(sql, function(err, rows2, fields) {
              if (!err) {
                var max_page = rows2[0].total / perpage + 1;
                res.json({
                  status: "success",
                  nowpage: req.params.now_page,
                  max_page: parseInt(max_page),
                  data: rows
                });
              } else {
                res.send({
                  status: "fail",
                  data: err
                });
              }
            });
          } else {
            console.log('article insert err ', err);
            res.send({
              status: "fail",
              data: err
            });
          }
        });
      }
    });
  });

};
module.exports = initializeEndpoints;