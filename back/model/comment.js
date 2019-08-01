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
    console.log(i);
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "INSERT INTO comment(user,content,parentcomment,body,createdUser,updatedUser) VALUES(?,?,?,?,?,?)";
        var params = [i.user_id, i.content_id, i.parent_id, i.body, i.user_id, i.user_id];
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
        var sql = "SELECT * FROM comment WHERE User = ?";
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
        var sql = "SELECT * FROM comment AS cm JOIN content AS ct ON cm.content = ct.pk AND ct.article = ?";
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
