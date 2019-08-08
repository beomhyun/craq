var mysql_dbc = require('../db/db_con.js')();
var connection = mysql_dbc.init();
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
const TRUE = 1;
const serverlog = require('./serverlog.js');

/**
 * @swagger
 * definitions:
 *   postInfo:
 *     type: object
 *     properties:
 *       topic:
 *         type: integer
 *       user_id:
 *         type: integer
 *   subscribeInfo:
 *     type: object
 *     properties:
 *       topic:
 *         type: string
 *         description: topic's name
 *       user:
 *         type: string
 *         description: user's name
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
   *  /subscribes:
   *    post:
   *      tags:
   *      - subscribe
   *      description: 유저가 해당 게시판을 구독함.
   *      responses:
   *        200:
   *      parameters:
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달.
   *      - name: postInfo
   *        in: body
   *        schema:
   *          $ref: '#/definitions/postInfo'
   */
  app.post('/subscribes', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
    }
      else {
        var sql = " INSERT INTO subscribe(topic,user) VALUES(?,?) ";
        var params = [req.body.topic, req.body.user_id];
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
   *  /subscribes:
   *    get:
   *      tags:
   *      - subscribe
   *      parameters:
   *      - in: header
   *        name: user_token
   *        type: string
   *        description:  사용자 토큰 전달
   *      description: 게시판 구독 정보()를 모두 가져옴.
   *      responses:
   *        200:
   */
  app.get('/subscribes', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
    }
      else {
        var sql = "SELECT * FROM subscribe";
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
            res.json(rows);
          } else {
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            // console.log('Error while performing Query.', err);
            res.send(err);
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /subscribes/{user}:
   *    get:
   *      tags:
   *      - subscribe
   *      parameters:
   *      - in: header
   *        name: user_token
   *        type: string
   *        description:  사용자 토큰 전달
   *      - in: path
   *        name: user
   *        type: integer
   *        description:  유저 id 전달
   *      description: 한 유저의 구독 정보(구독주제, 구독한 시간,기타 정보)를 가져옴.
   *      responses:
   *        200:
   */
  app.get('/subscribes/:user', function(req, res) {
    // console.log("해당 유저 구독 정보");
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
    }
      else {
        var sql = ` SELECT
                      S.TOPIC AS PK
                      ,T.TOPIC AS TOPIC
                      ,(SELECT
                          COUNT(*) AS COUNT
                        FROM
                          SUBSCRIBE
                        WHERE
                          TOPIC = S.TOPIC
                      ) AS SUBSCRIBES
                    FROM
                      SUBSCRIBE AS S
                        LEFT OUTER JOIN TOPIC AS T ON S.TOPIC = T.PK
                    WHERE
                      USER = ? `;
        var params = [req.params.user];
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
   *  /subscribes/{topic}/{user}:
   *    get:
   *      tags:
   *      - subscribe
   *      parameters:
   *      - in: path
   *        name: topic
   *        type: integer
   *        description:  topic의 id 값 전달
   *      - in: path
   *        name: user
   *        type: integer
   *        description:  user의 id 값 전달
   *      - in: header
   *        name: user_token
   *        type: string
   *        description:  사용자 토큰 전달
   *      description: 한 유저의 하나의 구독정보(구독주제,구독한 시간, 기타 정보)를 가져옴.
   *      responses:
   *        200:
   */
  app.get('/subscribes/:topic/:user', function(req, res) {
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
        SELECT    TOPIC
                , CREATEDUSER
        FROM      SUBSCRIBE
        WHERE     TOPIC  = ${req.params.topic}
        AND       USER   = ${req.params.user}
        AND       IS_REMOVED = 0
        `;
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
            res.send({status: "success", data: rows});
          } else {
            // console.log('Error while performing Query.', err);
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send({status: "fail"});
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /subscribes/{topic}/{user}:
   *    delete:
   *      tags:
   *      - subscribe
   *      parameters:
   *      - in: path
   *        name: topic
   *        type: integer
   *        description:  topic의 id 값 전달
   *      - in: path
   *        name: user
   *        type: integer
   *        description:  user의 id 값 전달
   *      - in: header
   *        name: user_token
   *        type: string
   *        description:  사용자 토큰 전달
   *      description: 어느 유저가 구독하던 게시판을 구독취소함.(데이터삭제)
   *      responses:
   *        200:
   */
  app.delete('/subscribes/:topic/:user/', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
    }
      else {
        var sql = "DELETE FROM subscribe WHERE Topic = ? AND User = ?";
        var params = [req.params.topic, req.params.user];
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
