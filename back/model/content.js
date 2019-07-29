var mysql_dbc = require('../db/db_con.js')();
var connection = mysql_dbc.init();
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
const multer = require('multer');
const path = require("path");
const TRUE = 1;

const initializeEndpoints = (app) => {
  /**
   * @swagger
   *  /contents:
   *    post:
   *      tags:
   *      - content
   *      description: 처음으로 content를 작성.(article도 post 됨)
   *      parameters:
   *      - name: contentInfo
   *        in: body
   *        schema:
   *          type: object
   *          properties:
   *            article_id:
   *              type: integer
   *              description: 작성할 article id값 전달.
   *            beforeContent:
   *              type: integer
   *              description: 참고한 content id값 전달
   *            title:
   *              type: string
   *              description: content의 제목 전달
   *            body:
   *              type: string
   *              description: content의 내용 전달
   *            image:
   *              type: string
   *              description: image 링크를 전달
   *            user_id:
   *              type: integer
   *              description: 작성자의 user id값 전달
   *            topic_id:
   *              type: integer
   *              description: topic id값 전달(질문과답변 등...)
   *            user_token:
   *              type: string
   *              description: 사용자의 token 정보
   *      responses:
   *        200:
   */
  app.post('/contents', function(req, res) {
    var i = req.body;
    var sql = "";
    var params = [];
    jwt.verify(i.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        if (i.beforeContent === 0) { // 이전에 작성한 content가 없는 최초의 article 작성일 때
          sql = "INSERT INTO content(title,body,image,createdUser,updatedUser) VALUES(?,?,?,?,?)";
          params = [i.title, i.body, i.image, i.user_id, i.user_id];
          connection.query(sql, params, function(err, rows, fields) {
            if (!err) {
              sql = "INSERT INTO article(topic,article,content,createdUser,updatedUser) VALUES(?,?,?,?,?)"
              params = [i.topic_id, i.article_id, rows.insertId, i.user_id, i.user_id];
              connection.query(sql, params, function(err, rows, fields) {
                if (!err) {
                  res.json(rows);
                } else {
                  console.log('Error while performing Query.', err);
                  res.send(err);
                }
              });
            } else {
              console.log('Error while performing Query.', err);
              res.send(err);
            }
          });
        } else { // 이전에 작성한 content가 있고 기존의 article이 존재할 때
          sql = "INSERT INTO content(Article,beforeContent,title,body,image,createdUser,updatedUser) VALUES(?,?,?,?,?,?,?)";
          params = [i.article_id, i.beforeContent, i.title, i.body, i.image, i.user_id, i.user_id];
          connection.query(sql, params, function(err, rows, fields) {
            if (!err) {
              // 기존 article의 content 값을 추가한 contetn id값으로 변경, updatedUser 수정
              sql = "UPDATE article SET content = ?, updatedUser = ? WHERE pk = ?";
              params = [row.insertId, i.user_id, i.article_id];
              connection.query(sql, params, function(err, rows, fields) {
                if (!err) {
                  res.json(rows);
                } else {
                  console.log('Error while performing Query.', err);
                  res.send(err);
                }
              });
            } else {
              console.log('Error while performing Query.', err);
              res.send(err);
            }
          });
        }
      }
    });
  });

  /**
   * @swagger
   *  /contents/articles/{id}:
   *    get:
   *      tags:
   *      - content
   *      description: 특정 article의 모든 content를 받아옴.
   *      parameters:
   *      - name: id
   *        in: path
   *        type: integer
   *        description: article의 id 값을 전달.
   *      - name: user_token
   *        in: query
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/contents/articles/:id', function(req, res) {
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "SELECT * FROM content WHERE article = ?";
        var params = [req.params.id];
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
   *  /contents/last/articles/{id}:
   *    get:
   *      tags:
   *      - content
   *      description: 특정 article의 마지막(최신) content를 받아옴(1)
   *      parameters:
   *      - name: id
   *        in: path
   *        type: integer
   *        description: article의 id 값을 전달.
   *      - name: user_token
   *        in: query
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/contents/last/articles/:id', function(req, res) {
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "SELECT * FROM content WHERE article = ? ORDER BY pk DESC limit 1";
        var params = [req.params.id];
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
   *  /contents/{id}:
   *    get:
   *      tags:
   *      - content
   *      description: 특정 content를 받아옴.(1)
   *      parameters:
   *      - name: id
   *        in: path
   *        type: integer
   *        description: content id 값을 전달.
   *      - name: user_token
   *        in: query
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/contents/:id', function(req, res) {
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "SELECT * FROM content WHERE pk = ?";
        var params = [req.params.id];
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
   *  /contents/{id}:
   *    put:
   *      tags:
   *      - content
   *      description: 특정 content의 내용을 수정.
   *      parameters:
   *      - name: id
   *        in: path
   *        type: integer
   *        description: content id 값을 전달.
   *      - name: title
   *        in: query
   *        type: string
   *        description: title의 내용 전달.
   *      - name: body
   *        in: query
   *        type: string
   *        description: body의 내용 전달.
   *      - name: image
   *        in: query
   *        type: string
   *        description: image의 링크 전달.
   *      - name: user_token
   *        in: query
   *        type: string
   *        description: 사용자의 token값을 전달.
   *      responses:
   *        200:
   */
  app.put('/contents/:id', function(req, res) {

    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "UPDATE content SET title = ?,body = ?, image = ? WHERE pk = ?";
        var params = [req.query.title,req.query.body,req.query.image,req.params.id];
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
   *  /contents/{id}:
   *    delete:
   *      tags:
   *      - content
   *      description: 특정 content를 삭제(플래그 처리후 삭제데이터 앞뒤로 이어줌)
   *      parameters:
   *      - name: id
   *        in: path
   *        type: integer
   *        description: content id 값을 전달.
   *      - name: user_token
   *        in: query
   *        type: string
   *        description: 사용자의 token값을 전달.
   *      responses:
   *        200:
   */
  app.delete('/contents/:id', function(req, res) {
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = `UPDATE content SET is_removed = ${TRUE} WHERE pk = ?`;
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
