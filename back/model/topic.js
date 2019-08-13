var mysql_dbc = require('../db/db_con.js')();
var connection = mysql_dbc.init();
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
const TRUE = 1;
const serverlog = require('./serverlog.js');

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
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달.
   *      - name: topicInfo
   *        in: body
   *        schema:
   *          $ref: '#/definitions/topicInfo'
   */
  app.post('/topics', function(req, res) {
    jwt.verify(req.headers.user_token,  secretObj.secret, function(err, decoded) {
      if(err) {
        res.status(401).send({error:'invalid token'});
        serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
      }
      else{
        var sql = "INSERT INTO topic(topic,createdUser,updatedUser) VALUES(?,?,?)";
        var params = [req.body.topic, decoded.pk, req.body.user_id];
        connection.query(sql, params, function(err, rows, fields) {
          if (!err) {
            serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
            res.json(rows);
          } else {
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send(err);
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /topics:
   *    get:
   *      tags:
   *      - topic
   *      parameters:
   *       - in: header
   *         name: user_token
   *         type: string
   *         description: |
   *          사용자 토큰 전달
   *      description: 사용자의 토큰을 받아 모든 게시판을 보여줌.
   *      responses:
   *        200:
   */
  app.get('/topics', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
    }
      else {
        var sql = ` SELECT
                      T.PK AS PK
                      ,T.TOPIC
                      ,IFNULL(S.CNT, 0) AS SUBSCRIBES
                      ,T.IS_ACTIVE AS ACTIVED
                    FROM 
                      TOPIC AS T
                        LEFT OUTER JOIN (SELECT
                                      TOPIC,
                                      COUNT(TOPIC) AS CNT
                                    FROM
                                      SUBSCRIBE
                                    GROUP BY TOPIC) AS S
                        ON T.PK = S.TOPIC
                    WHERE PK NOT IN (1,2)
                          AND IS_ACTIVE = 1
                    ORDER BY SUBSCRIBES DESC`;
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
            res.json(rows);
          } else {
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send(err);
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /topics/users/{user}:
   *    get:
   *      tags:
   *      - topic
   *      parameters:
   *       - in: header
   *         name: user_token
   *         type: string
   *         description: |
   *          사용자 토큰 전달
   *       - in: path
   *         name: user
   *         type: integer
   *         description: 유저 아이디를 전달
   *      description: 해당 유저가 만든 게시판을 보여줌
   *      responses:
   *        200:
   */
  app.get('/topics/users/:user', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
    }
      else {
        var sql = ` SELECT
                      T.PK AS PK
                      ,T.TOPIC AS TOPIC
                      ,IFNULL(S.CNT, 0) AS SUBSCRIBES
                      ,T.IS_ACTIVE AS ACTIVED
                    FROM 
                      TOPIC AS T
                        LEFT OUTER JOIN (SELECT
                                      TOPIC,
                                      COUNT(TOPIC) AS CNT
                                    FROM
                                      SUBSCRIBE
                                    GROUP BY TOPIC) AS S
                        ON T.PK = S.TOPIC
                    WHERE T.CREATEDUSER = ${req.params.user} 
                          AND T.IS_ACTIVE = 1
                    `;
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
            res.json(rows);
          } else {
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send(err);
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /topics/actived:
   *    get:
   *      tags:
   *      - topic
   *      parameters:
   *       - in: header
   *         name: user_token
   *         type: string
   *         description: |
   *          사용자 토큰 전달
   *      description: 사용자의 토큰을 받아 활성화된 게시판을 보여줌.
   *      responses:
   *        200:
   */
  app.get('/topics/actived', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
    }
      else {
        var sql = ` SELECT
                      T.PK AS PK
                      ,T.TOPIC
                      ,IFNULL(S.CNT, 0) AS SUBSCRIBES
                    FROM 
                      TOPIC AS T
                        LEFT OUTER JOIN (SELECT
                                      TOPIC,
                                      USER,
                                      COUNT(TOPIC) AS CNT
                                    FROM
                                      SUBSCRIBE
                                    GROUP BY TOPIC) AS S
                        ON T.PK = S.TOPIC
                    WHERE T.IS_ACTIVE = ${TRUE} `;
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
            res.json(rows);
          } else {
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send(err);
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /topics/{pk}:
   *    put:
   *      tags:
   *      - topic
   *      description: 고유한 id값을 갖는 게시판의 정보를 수정
   *      parameters:
   *      - name: pk
   *        in: path
   *        type: integer
   *      - name: info
   *        in: query
   *        type: string
   *      - in: header
   *        name: user_token
   *        type: string
   *        description: |
   *         사용자 토큰 전달
   *      responses:
   *        200:
   */
  app.put('/topics/:pk', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
    }
      else {
        var sql = " UPDATE topic SET info = ? WHERE pk = ? ";
        var params = [req.query.info, req.params.pk];
        connection.query(sql, params, function(err, rows, fields) {
          if (!err) {
            serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
            res.send({status: "success"});
          } else {
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send({status: "fail", data: err});
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /topics/permission/{pk}:
   *    put:
   *      tags:
   *      - topic
   *      description: 해당 게시판의 승인
   *      parameters:
   *      - name: pk
   *        in: path
   *        type: integer
   *      - in: header
   *        name: user_token
   *        type: string
   *        description: |
   *         사용자 토큰 전달
   *      responses:
   *        200:
   */
  app.put('/topics/permission/:pk', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
    }
      else {
        var sql = " UPDATE topic SET is_active = 1 WHERE pk = ? ";
        var params = [req.params.pk];
        connection.query(sql, params, function(err, rows, fields) {
          if (!err) {
            sql = " insert into manager(topic,user,first) values(?,(select t.createduser from topic as t where t.pk  = ?),1) ";
            params = [req.params.pk,req.params.pk];
            connection.query(sql, params, function(err, rows, fields) {
              if(!err){
                serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
                res.send({status: "success"});
              }else{
                serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
                res.send({status: "fail", data: err});
              }
            });
          } else {
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send({status: "fail", data: err});
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /topics/{id}:
   *    delete:
   *      tags:
   *      - topic
   *      description: 해당 id의 게시판 삭제 (데이터 삭제가 아닌 플래그 처리)
   *      parameters:
   *      - name: id
   *        in: path
   *        type: integer
   *      - in: header
   *        name: user_token
   *        type: string
   *        description: |
   *         사용자 토큰 전달
   *      responses:
   *        200:
   */
  app.delete('/topics/:id', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
    }
      else {
        var sql = `UPDATE topic SET is_removed = ${TRUE} WHERE pk = ?`;
        var params = req.params.id;
        connection.query(sql, params, function(err, rows, fields) {
          if (!err) {
            serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
            res.json(rows);
          } else {
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send(err);
          }
        });
      }
    });
  });
 /**
   * @swagger
   *  /topics/search:
   *    get:
   *      tags:
   *      - topic
   *      parameters:
   *       - in: query
   *         name: title
   *         type: string
   *         description: |
   *          검색할 게시판 제목 전달
   *       - in: header
   *         name: user_token
   *         type: string
   *         description: |
   *          사용자 토큰 전달
   *      description: 사용자의 토큰, 제목 검색 키워드를 받아 활성화된 게시판을 보여줌.
   *      responses:
   *        200:
   */
  app.get('/topics/search', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
    }
      else {
        //var sql = ' SELECT pk,topic FROM topic WHERE topic like "'+'%' + req.query.title + '%" and is_active =  1 ';
        sql = ` SELECT pk,topic FROM topic WHERE topic like "%${req.query.title}%" and is_active =  ${TRUE} and topic !=1`;
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
            res.json(rows);
          } else {
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send(err);
          }
        });
      }
    });
  });

    /**
   * @swagger
   *  /topics/pk/{pk}:
   *    get:
   *      tags:
   *      - topic
   *      parameters:
   *       - in: header
   *         name: user_token
   *         type: string
   *         description: |
   *          사용자 토큰 전달
   *       - in: path
   *         name: pk
   *         type: integer
   *         description: |
   *          사용자 토큰 전달   
   *      responses:
   *        200:
   */
  app.get('/topics/pk/:pk', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
    }
      else {
        var sql = ` SELECT
                      T.PK
                      ,T.TOPIC
                      ,(SELECT
                          COUNT(*)
                        FROM
                          SUBSCRIBE AS S
                        WHERE
                          S.TOPIC = T.PK
                          AND S.USER = ${decoded.pk}
                      ) AS IS_SUBSCRIBE
                    FROM 
                      TOPIC AS T
                    WHERE
                      T.PK = ${req.params.pk} `;
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
            res.json({status:"success", data: rows});
          } else {
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send({status: "fail", datA:err});
          }
        });
      }
    });
  });

};
 
module.exports = initializeEndpoints;
