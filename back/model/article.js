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
    var sql = '';
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        sql = `SELECT COUNT(PK) AS TOTAL_ARTICLE FROM ARTICLE WHERE IS_REMOVED = ${FALSE} AND TOPIC = ${req.params.topic}`;
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            var totalArticle = rows[0].TOTAL_ARTICLE;
            //나올 수 있는 총 페이지의 수를 구한다.
            var totalPage = totalArticle / ARTICLE_PER_PAGE;
            if (totalArticle > totalPage * ARTICLE_PER_PAGE) {
              totalPage++;
            }
            sql = `SELECT B.ROWNUM, B.TOPIC, B.TITLE, B.CREATEDUSER, B.CREATED_AT FROM ( SELECT ROW_NUMBER() OVER( ORDER BY A.PK DESC ) AS ROWNUM, A.TOPIC, C.TITLE, C.CREATEDUSER, C.CREATED_AT, ( SELECT COUNT(ARTICLE) FROM VIEW WHERE ARTICLE = A.PK ) AS VIEW, ( SELECT SUM(GOOD) FROM VOTE WHERE ARTICLE = A.PK ) AS VOTE FROM ARTICLE AS A JOIN CONTENT AS C ON A.CONTENT = C.PK WHERE A.TOPIC = ${req.params.topic} AND A.IS_REMOVED = ${FALSE}) AS B WHERE ROWNUM >  ${ARTICLE_PER_PAGE}*(${req.params.page}-1) AND ROWNUM <= ${req.params.page}*${ARTICLE_PER_PAGE}`;
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


};
module.exports = initializeEndpoints;
