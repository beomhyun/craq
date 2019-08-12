var mysql_dbc = require('../db/db_con.js')();
var connection = mysql_dbc.init();
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
const TRUE = 1;
const FALSE = 0;
const serverlog = require('./serverlog.js');

const initializeEndpoints = (app) => {
  /**
   * @swagger
   *  /managers:
   *    post:
   *      tags:
   *      - manager
   *      description: 특정 게시판의 manager로 등록한다.
   *      parameters:
   *      - name: managerInfo
   *        in: body
   *        schema:
   *          type: object
   *          properties:
   *            topic_id:
   *              type: integer
   *              description: topic의 id값
   *            user_id:
   *              type: integer
   *              description: user의 id값
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.post('/managers', function(req, res) {
    var i = req.body;
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
    }else {
        var sql =
        `
        SELECT  COUNT(*) COUNT
        FROM    MANAGER
        WHERE   TOPIC   = ${i.topic_id}
        AND     USER    = ${i.user_id}
        `;
        connection.query(sql, function(err, rows, fields) {
          if (!err && rows[0].COUNT == 0){
            sql =
            `
            INSERT    INTO
            MANAGER   (TOPIC,USER)
            VALUES    (${i.topic_id},${i.user_id})
            `;
            connection.query(sql, function(err, rows, fields) {
              if (!err){
                serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
                res.send({status: "success"});
              } else{
                serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
                res.send({status: "fail",msg: "insert err"});
              }
            });
          }else{
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send({status: "fail", msg: " select err or data exist"});
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /managers:
   *    get:
   *      tags:
   *      - manager
   *      description: 모든 관리자의 정보들을 가져온다
   *      parameters:
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.get('/managers', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
    }else {
        var sql =
        `
        SELECT    USER
                , (
                  SELECT  USERNAME
                  FROM    USER
                  WHERE   PK = USER
                ) USERNAME
                , TOPIC
                , (
                  SELECT  TOPIC
                  FROM    TOPIC
                  WHERE   PK = M.TOPIC
                ) TOPICNAME
                , IFNULL(FIRST,0) FIRST
                , CREATED_AT
        FROM      MANAGER M
        WHERE     IS_REMOVED = 0
        `;
        connection.query(sql, function(err, rows, fields) {
          if (!err){
            serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
            res.send({status: "success", data:rows});
          } else{
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send({status: "fail",msg: "select err"});
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /managers/{topic}:
   *    get:
   *      tags:
   *      - manager
   *      description: 특정 게시판의 관리자들의 정보를 가져온다.
   *      parameters:
   *      - name: topic
   *        in: path
   *        type: integer
   *        description: topic의 id값
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.get('/managers/:topic', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
    }else {
        var sql =
        `
        SELECT    USER
                , (
                  SELECT  USERNAME
                  FROM    USER
                  WHERE   PK = USER
                ) USERNAME
                , TOPIC
                , (
                  SELECT  TOPIC
                  FROM    TOPIC
                  WHERE   PK = M.TOPIC
                ) TOPICNAME
                , IFNULL(FIRST,0) FIRST
                , CREATED_AT
        FROM      MANAGER M
        WHERE     TOPIC = ${req.params.topic}
        AND       M.IS_REMOVED = 0
        `;
        connection.query(sql, function(err, rows, fields) {
          if (!err){
            serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
            res.send({status: "success", data:rows});
          } else{
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send({status: "fail",msg: "select err"});
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /managers/{topic}/{user}:
   *    get:
   *      tags:
   *      - manager
   *      description: 특정 관리자의 정보를 가져온다.
   *      parameters:
   *      - name: topic
   *        in: path
   *        type: integer
   *        description: topic의 id값
   *      - name: user
   *        in: path
   *        type: integer
   *        description: user의 id값
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.get('/managers/:topic/:user', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
    }else {
        var sql =
        `
        SELECT    COUNT(*) COUNT
                , USER
                , (
                  SELECT  USERNAME
                  FROM    USER
                  WHERE   PK = USER
                ) USERNAME
                , TOPIC
                , (
                  SELECT  TOPIC
                  FROM    TOPIC
                  WHERE   PK = M.TOPIC
                ) TOPICNAME
                , IFNULL(FIRST,0) FIRST
                , CREATED_AT
        FROM      MANAGER M
        WHERE     TOPIC = ${req.params.topic}
        AND       USER  = ${req.params.user}
        AND       M.IS_REMOVED = 0
        `;
        connection.query(sql, function(err, rows, fields) {
          if (!err&&rows[0].COUNT >0){
            serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
            res.send({status: "success", data:rows[0]});
          } else{
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send({status: "fail",msg: "select err"});
          }
        });
      }
    });
  });

    /**
     * @swagger
     *  /managers/{topic}/{user}:
     *    delete:
     *      tags:
     *      - manager
     *      description: 특정 관리자의 정보를 삭제 (플래그처리)
     *      parameters:
     *      - name: topic
     *        in: path
     *        type: integer
     *        description: topic의 id값
     *      - name: user
     *        in: path
     *        type: integer
     *        description: user의 id값
     *      - name: user_token
     *        in: header
     *        type: string
     *        description: 사용자의 token값을 전달
     *      responses:
     *        200:
     */
    app.delete('/managers/:topic/:user', function(req, res) {
      jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
        if (err) {
          res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
      }else {
          var sql =
          `
          SELECT  COUNT(*) COUNT
          FROM    MANAGER
          WHERE   TOPIC      = ${req.params.topic}
          AND     USER       = ${req.params.user}
          `;
          connection.query(sql, function(err, rows, fields) {
            if (!err && rows[0].COUNT == 1){
              sql =
              `
              UPDATE  MANAGER
              SET     IS_REMOVED = 1
              WHERE   TOPIC      = ${req.params.topic}
              AND     USER       = ${req.params.user}
              `;
              connection.query(sql, function(err, rows, fields) {
                if (!err){
                  serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
                  res.send({status: "success"});
                } else{
                  serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
                  res.send({status: "fail",msg: "update err"});
                }
              });
            } else{
              serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
              res.send({status: "fail",msg: "don't exist data"});
            }
          });
        }
      });
  });

};
module.exports = initializeEndpoints;
