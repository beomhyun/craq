var mysql_dbc = require('../db/db_con.js')();
var connection = mysql_dbc.init();
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
const TRUE = 1;

const initializeEndpoints = (app) => {
  /**
   * @swagger
   *  /hashtags:
   *    post:
   *      tags:
   *      - hashtag
   *      description:
   *      parameters:
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달.
   *      - name: hashtagInfo
   *        in: body
   *        schema:
   *          type: object
   *          properties:
   *            content_id:
   *              type: integer
   *              description: content의 id값
   *            tag_id:
   *              type: integer
   *              description: tag의 id값
   *      responses:
   *        200:
   */
  app.post('/hashtags', function(req, res) {
    var i = req.body;
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "INSERT INTO hashtag(content,hashtag,createdUser,updatedUser) ( SELECT c.pk,t.pk,c.createdUser,c.createdUser FROM content as c JOIN tag as t WHERE c.pk = ? AND t.pk = ? )";
        var params = [i.content_id, i.tag_id];
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
   *  /hashtags:
   *    get:
   *      tags:
   *      - hashtag
   *      description: 모든 해시태그 정보를 받아옴.
   *      parameters:
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.get('/hashtags', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "SELECT * FROM hashtag";
        connection.query(sql, function(err, rows, fields) {
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
   *  /hashtags/contents/{id}:
   *    get:
   *      tags:
   *      - hashtag
   *      description: 특정 content의 모든 해시태그들을 받아옴.
   *      parameters:
   *      - name: id
   *        in: path
   *        type: integer
   *        description: 특정 content의 id값을 전달
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.get('/hashtags/contents/:id', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "SELECT * FROM hashtag WHERE content = ?";
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
   *  /hashtags/contents/{c_id}/tags/{t_id}:
   *    get:
   *      tags:
   *      - hashtag
   *      description: 특정 해시태그의 정보를 가져옴.(1)
   *      parameters:
   *      - name: c_id
   *        in: path
   *        type: integer
   *        description: 특정 content id값을 전달
   *      - name: t_id
   *        in: path
   *        type: integer
   *        description: 특정 tag id값을 전달
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.get('/hashtags/contents/:c_id/tags/:t_id', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "SELECT * FROM hashtag WHERE content = ? AND hashtag = ?";
        var params = [req.params.c_id,req.params.t_id];
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
   *  /hashtags/contents/{c_id}/tags/{t_id}:
   *    delete:
   *      tags:
   *      - hashtag
   *      description: 특정 해시태그를 삭제(1)
   *      parameters:
   *      - name: c_id
   *        in: path
   *        type: integer
   *        description: 특정 content id값을 전달
   *      - name: t_id
   *        in: path
   *        type: integer
   *        description: 특정 tag id값을 전달
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.delete('/hashtags/contents/:c_id/tags/:t_id', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "DELETE FROM hashtag WHERE content = ? AND hashtag = ?";
        var params = [req.params.c_id,req.params.t_id];
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
