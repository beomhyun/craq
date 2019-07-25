var mysql_dbc = require('../db/db_con.js')();
var connection = mysql_dbc.init();
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
const TRUE = 1;
/**
 * @swagger
 * definitions:
 *   topicInfo:
 *     type: object
 *     properties:
 *       pk:
 *         type: integer
 *         description: topic's id
 *       topic:
 *         type: string
 *         description: topic's name
 *       createdUser:
 *         type: integer
 *         description: id of user who create the information
 *       updatedUser:
 *         type: integer
 *         description: id of user who update the information
 *       is_public:
 *         type: integer
 *         description: visibilty check
 *       is_active:
 *         type: integer
 *         description: activity check
 *       is_removed:
 *         type: integer
 *         description: remove check
 *       ip_address:
 *         type: string
 *         description: user's ip
 *       info:
 *         type: string
 *         description: information or detailed description
 */

const initializeEndpoints = (app) => {
  /**
   * @swagger
   *  /topics:
   *    post:
   *      tags:
   *      - topic
   *      description: create board of new topic
   *      responses:
   *        200:
   *      parameters:
   *      - name: topicInfo
   *        in: body
   *        schema:
   *          $ref: '#/definitions/topicInfo'
   */
  app.post('/topics', function(req, res) {
    var sql = "INSERT INTO topic(topic,createdUser,updatedUser) VALUES(?,?,?)";
    var params = [req.body.topic, req.body.user_id, req.body.user_id];
    connection.query(sql, params, function(err, rows, fields) {
      if (!err) {
        res.json(rows);
      } else {
        console.log('Error while performing Query.', err);
        res.send(err);
      }
    });
  });

  /**
   * @swagger
   *  /topics/{user_token}:
   *    get:
   *      tags:
   *      - topic
   *      parameters:
   *       - in: path
   *         name: user_token
   *         type: string
   *         description: |
   *          사용자 토큰 전달
   *      description: 사용자의 토큰을 받아 모든 게시판을 보여줌.
   *      responses:
   *        200:
   */
  app.get('/topics/:user_token', function(req, res) {
    jwt.verify(req.params.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "SELECT pk,topic FROM topic";
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            res.json(rows);
          } else {
            res.send(err);
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /topics/actived/{user_token}:
   *    get:
   *      tags:
   *      - topic
   *      parameters:
   *       - in: path
   *         name: user_token
   *         type: string
   *         description: |
   *          사용자 토큰 전달
   *      description: 사용자의 토큰을 받아 활성화된 게시판을 보여줌.
   *      responses:
   *        200:
   */
  app.get('/topics/actived/:user_token', function(req, res) {
    jwt.verify(req.params.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = `SELECT pk,topic FROM topic WHERE is_active = ${TRUE}`;
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            res.json(rows);
          } else {
            res.send(err);
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /topics/{id}/{user_token}:
   *    put:
   *      tags:
   *      - topic
   *      description: 고유한 id값을 갖는 게시판의 정보를 가져옴
   *      parameters:
   *      - name: topicInfo
   *        in: body
   *        schema:
   *          $ref: '#/definitions/topicInfo'
   *      - in: path
   *        name: user_token
   *        type: string
   *        description: |
   *         사용자 토큰 전달
   *      responses:
   *        200:
   */
  app.put('/topics/:id/:user_token', function(req, res) {
    jwt.verify(req.params.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "UPDATE topic SET updatedUser = ?,is_public = ?, is_active = ?, is_removed = ?, ip_address = ?, info = ? WHERE pk = ?";
        var i = req.body;
        var params = [i.updatedUser, i.is_public, i.is_active, i.is_removed, i.ip_address, i.info, i.pk];
        connection.query(sql, params, function(err, rows, fields) {
          if (!err) {
            res.json(rows);
          } else {
            res.send(err);
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /topics/{id}/{user_token}:
   *    delete:
   *      tags:
   *      - topic
   *      description: 해당 id의 게시판 삭제 (데이터 삭제가 아닌 플래그 처리)
   *      parameters:
   *      - name: id
   *        in: path
   *        type: integer
   *      - in: path
   *        name: user_token
   *        type: string
   *        description: |
   *         사용자 토큰 전달
   *      responses:
   *        200:
   */
  app.delete('/topics/:id/:user_token', function(req, res) {
    jwt.verify(req.params.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = `UPDATE topic SET is_removed = ${TRUE} WHERE pk = ?`;
        var params = req.params.id;
        connection.query(sql, params, function(err, rows, fields) {
          if (!err) {
            res.json(rows);
          } else {
            res.send(err);
          }
        });
      }
    });
  });
};

module.exports = initializeEndpoints;
