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
   *  /notices:
   *    post:
   *      tags:
   *      - notice
   *      description: 알림을 추가한다.
   *      parameters:
   *      - name: noticeInfo
   *        in: body
   *        schema:
   *          type: object
   *          properties:
   *            user_id:
   *              type: integer
   *              description: user의 id값
   *            type_id:
   *              type: integer
   *              description: type의 id값
   *            body:
   *              type: string
   *              description: 전달할 내용
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.post('/notices', function(req, res) {
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
          INSERT  INTO
          NOTICE  (USER,TYPE,BODY)
          VALUES  (${i.user_id},${i.type_id},'${i.body}')
        `;
        connection.query(sql, function(err, rows, fields) {
          if (!err){
            serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
            res.send({status: "success"});
          }else{
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send({status: "fail"});
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /notices:
   *    get:
   *      tags:
   *      - notice
   *      description: 모든 알림 정보를 가져옴.
   *      parameters:
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.get('/notices', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
    }else {
        var sql =
        `
          SELECT  *
          FROM    NOTICE
          WHERE   IS_REMOVED = 0
        `;
        connection.query(sql, function(err, rows, fields) {
          if (!err){
            serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
            res.send({status: "success", data:rows});
          }else{
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send({status: "fail"});
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /notices/checks:
   *    get:
   *      tags:
   *      - notice
   *      description: 확인한 알림 정보들을 모두 가져옴. is_active = 1 이면 '확인했음'을 나타냄
   *      parameters:
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.get('/notices/checks', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
    }else {
        var sql =
        `
          SELECT  *
          FROM    NOTICE
          WHERE   IS_ACTIVE  = 1
          AND     IS_REMOVED = 0
        `;
        connection.query(sql, function(err, rows, fields) {
          if (!err){
            serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
            res.send({status: "success", data:rows});
          }else{
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send({status: "fail"});
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /notices/no-checks:
   *    get:
   *      tags:
   *      - notice
   *      description: 확인하지 않은 알림 정보들을 모두 가져옴. is_active = 0 이면 '확인안함'을 나타냄
   *      parameters:
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.get('/notices/no-checks', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
    }else {
        var sql =
        `
          SELECT  *
          FROM    NOTICE
          WHERE   IS_ACTIVE  = 0
          AND     IS_REMOVED = 0
        `;
        connection.query(sql, function(err, rows, fields) {
          if (!err){
            serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
            res.send({status: "success", data:rows});
          }else{
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send({status: "fail"});
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /notices/{user_id}:
   *    get:
   *      tags:
   *      - notice
   *      description: 특정 user의 모든 알림 정보를 가져옴.
   *      parameters:
   *      - name: user_id
   *        in: path
   *        type: integer
   *        description: user의 id 값
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.get('/notices/:user_id', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
    }else {
        var sql =
        `
          SELECT    *
          FROM      NOTICE
          WHERE     USER        =   ${req.params.user_id}
          AND       IS_REMOVED  =   0
        `;
        connection.query(sql, function(err, rows, fields) {
          if (!err){
            serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
            res.send({status: "success", data:rows});
          }else{
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send({status: "fail"});
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /notices/checks/{user_id}:
   *    get:
   *      tags:
   *      - notice
   *      description: 특정 user의 확인한 알림 정보를 가져옴.
   *      parameters:
   *      - name: user_id
   *        in: path
   *        type: integer
   *        description: user의 id 값
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.get('/notices/checks/:user_id', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
    }else {
        var sql =
        `
          SELECT    *
          FROM      NOTICE
          WHERE     USER        =   ${req.params.user_id}
          AND       IS_ACTIVE   =   1
          AND       IS_REMOVED  =   0
        `;
        connection.query(sql, function(err, rows, fields) {
          if (!err){
            serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
            res.send({status: "success", data:rows});
          }else{
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send({status: "fail"});
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /notices/no-checks/{user_id}:
   *    get:
   *      tags:
   *      - notice
   *      description: 특정 user의 확인하지 않은 알림 정보를 가져옴.
   *      parameters:
   *      - name: user_id
   *        in: path
   *        type: integer
   *        description: user의 id 값
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.get('/notices/no-checks/:user_id', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
    }else {
        var sql =
        `
          SELECT    *
          FROM      NOTICE
          WHERE     USER        =   ${req.params.user_id}
          AND       IS_ACTIVE   =   0
          AND       IS_REMOVED  =   0
        `;
        connection.query(sql, function(err, rows, fields) {
          if (!err){
            serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
            res.send({status: "success", data:rows});
          }else{
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send({status: "fail"});
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /notices:
   *    put:
   *      tags:
   *      - notice
   *      description: 특정 알림의 정보를 수정함.
   *      parameters:
   *      - name: pk
   *        in: query
   *        type: integer
   *        description: notice의 pk값
   *      - name: body
   *        in: query
   *        type: string
   *        description: 수정할 내용
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.put('/notices', function(req, res) {
    var i = req.query;
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
    }else {
        var sql =
        `
          UPDATE  NOTICE
          SET     BODY    = '${i.body}'
          WHERE   PK      = ${i.pk}
        `;
        connection.query(sql, function(err, rows, fields) {
          if (!err){
            serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
            res.send({status: "success"});
          }else{
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send({status: "fail"});
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /notices/{pk}:
   *    delete:
   *      tags:
   *      - notice
   *      description: 특정 알림의 정보를 삭제
   *      parameters:
   *      - name: pk
   *        in: path
   *        type: integer
   *        description: notice의 pk값
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.delete('/notices/:pk', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
    }else {
        var sql =
        `
          UPDATE  NOTICE
          SET     IS_REMOVED  =  1
          WHERE   PK          =  ${req.params.pk}
        `;
        connection.query(sql, function(err, rows, fields) {
          if (!err){
            serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
            res.send({status: "success"});
          }else{
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send({status: "fail"});
          }
        });
      }
    });
  });


};
module.exports = initializeEndpoints;
