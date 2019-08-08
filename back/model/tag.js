var mysql_dbc = require('../db/db_con.js')();
var connection = mysql_dbc.init();
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
const TRUE = 1;
const FALSE = 0;
const TAG_PER_PAGE = 12;
const serverlog = require('./serverlog.js');

const initializeEndpoints = (app) => {
  /**
   * @swagger
   *  /tags:
   *    post:
   *      tags:
   *      - tag
   *      description: 하나의 태그를 작성, 이름이 정확히 일치할 경우 생성하지 않음
   *      parameters:
   *       - in: body
   *         name: contentsbody
   *         schema:
   *           type: object
   *           properties:
   *             title:
   *               type: string
   *             body:
   *               type: string
   *       - in: header
   *         name: user_token
   *         type: string
   *         description: 사용자의 token 값
   *      responses:
   *        200:
   */
  app.post('/tags', function(req, res) {
    var i = req.body;
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
    }
      else {
        sql =
              `
                SELECT   COUNT( PK ) AS COUNT
                        ,PK
                FROM     TAG
                WHERE    TITLE LIKE '${i.title}'
              `;
        connection.query(sql, function(err, rows1, fields) {
          if( rows1[0].COUNT == 0 ){ // 작성된 topic이 없다면
            // console.log(rows[0].COUNT);
            sql =
            `
              INSERT  INTO
              TAG     ( TITLE, BODY, CREATEDUSER, UPDATEDUSER )
              VALUES  ( ${"'"+i.title+"'"}, ${"'"+i.body+"'"}, ${decoded.pk}, ${decoded.pk} )
            `;
            connection.query(sql, function(err, rows2, fields) {
              if(!err){
                // console.log(rows2.insertId);
                serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
                res.send({status: "success",data: rows2.insertId});
              }else{
                serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
                res.send({status: "fail"});
              }
            });
          }else{
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send({status: "fail", data: rows1[0].PK});
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /tags:
   *    get:
   *      tags:
   *      - tag
   *      description: 모든 태그를 받아옴.
   *      parameters:
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.get('/tags', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
    }
     else {
        var sql = "SELECT * FROM tag";
        connection.query(sql, function(err, rows, fields) {
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
   *  /tags/{title}:
   *    get:
   *      tags:
   *      - tag
   *      description: 특정 태그의 정보를 받아옴(1). 없으면 생성함.
   *      parameters:
   *      - name: title
   *        in: query
   *        type: string
   *        description: 검색할 tag의 이름(title)을 전달.
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.get('/tags/:title', function(req, res) {
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
                    SELECT   COUNT(PK) AS COUNT
                    FROM     TAG
                    WHERE    TITLE LIKE '${req.query.title}'
                  `;
        connection.query(sql, function(err, rows, fields) {
          if (!err){
            if(rows[0].COUNT == 0){ // 해당 tag가 존재하지 않는다면
              // 받아온 title명으로 tag를 등록한다.
              sql =
              `
                INSERT  INTO
                TAG     ( TITLE )
                VALUES  ( '${req.query.title}')
              `;
              connection.query(sql, function(err, rows, fields) {
                if (err){
                  serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
                  res.send({status: "fail"});
                }
              });
            }
            // 존재하고 있던, 또는 생성한 후에 해당정보를 가져온다.
            sql =
                  `
                    SELECT  *
                    FROM    TAG
                    WHERE   TITLE LIKE '${req.query.title}'
                  `;
            connection.query(sql, function(err, rows, fields) {
              if (!err){
                serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
                res.send({status: "success",data:rows[0]});
              }else{
                serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
                res.send({status: "fail"});
              }
            });
          }
        });
      }
    });
  });



  /**
   * @swagger
   *  /tags/{id}:
   *    put:
   *      tags:
   *      - tag
   *      description: 특정 태그의 정보와 수정시간, 수정자를 갱신함
   *      parameters:
   *      - name: id
   *        in: path
   *        type: integer
   *        description: 특정 태그의 id 값을 전달
   *      - name: user_id
   *        in: query
   *        type: integer
   *        description: 수정한 user의 id 값을 전달
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
  app.put('/tags/:id', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
    }
      else {
        var sql = "UPDATE tag SET body = ?, updatedUser = ? WHERE pk = ?";
        var params = [req.query.body, req.query.user_id, req.params.id];
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
   *  /tags/{id}:
   *    delete:
   *      tags:
   *      - tag
   *      description: 특정 태그를 삭제.
   *      parameters:
   *      - name: id
   *        in: path
   *        type: integer
   *        description: 특정 태그의 id 값을 전달
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.delete('/tags/:id', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
        error: 'invalid token'
      });
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
    }
      else {
        var sql = "DELETE FROM tag WHERE pk = ?";
        var params = req.params.id;
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
   *  /tags/mains/{page}:
   *    get:
   *      tags:
   *      - tag
   *      description: 해당 페이지의 tag들을 가져옴 (12)
   *      parameters:
   *      - name: page
   *        in: path
   *        type: integer
   *        description: 특정 위치의 page값을 전달.
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.get('/tags/mains/:page', function(req, res) {
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
                    SELECT  COUNT(PK) AS COUNT
                    FROM    TAG
                    WHERE   IS_REMOVED = ${FALSE}
                  `;
        connection.query(sql, function(err, rows, fields) {
          var totalTag = rows[0].COUNT;
          var totalPage = parseInt(totalTag / TAG_PER_PAGE);      //  예 ) 26 / 12 => "2"
          if(totalTag > totalPage * TAG_PER_PAGE){
            totalPage++;
          }
          if(totalPage < req.params.page){
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send({status: "fail"});
          }else{
            sql =
                      `
                        SELECT	  	T.PK
                          		 	 ,	T.TITLE
                                  ,	T.BODY
                                  ,(SELECT
                                    COUNT(*)
                                  FROM
                                    HASHTAG AS H
                                  WHERE
                                    H.HASHTAG = T.PK
                                  ) AS COUNT
                        FROM 			  TAG AS T
                        WHERE			  T.IS_REMOVED = ${FALSE}
                        ORDER BY 	  COUNT DESC
                        LIMIT 		  ${(req.params.page-1)*TAG_PER_PAGE}, ${TAG_PER_PAGE}
                      `;

            connection.query(sql, function(err, rows, fields) {
              if (!err){
                serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
                res.send({status: "success", data: rows, maxPage:totalPage});
              }else{
                serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
                res.send({status: "fail"});
              }
            });
          }          
        });
      }
    });
  });

  /**
   * @swagger
   *  /tags/weekly/topten:
   *    get:
   *      tags:
   *      - tag
   *      description: 주간 Top 10 태그
   *      parameters:
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.get('/tags/weekly/topten', function(req, res) {
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
                  SELECT
                      TAB.PK
                      ,TAB.TITLE
                      ,COUNT(*) AS COUNT
                  FROM
                    (
                    SELECT
                      T.PK AS PK
                      ,T.TITLE AS TITLE
                      FROM
                        HASHTAG AS H
                          LEFT OUTER JOIN TAG AS T ON H.HASHTAG = T.PK
                      WHERE
                        H.CREATED_AT BETWEEN (NOW() - INTERVAL 7 DAY) AND NOW()
                    ) AS TAB
                  GROUP BY TAB.TITLE
                  ORDER BY COUNT DESC
                  LIMIT 0,10
                  `;
        connection.query(sql, function(err, rows, fields) {
          // console.log(rows);
          if (!err) {
            serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
            res.json({status: "success", data: rows});
          } else {
            // console.log('Error while performing Query.', err);
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send({status:"fail", data: err});
          }
        });
      }
    });
  });

    /**
   * @swagger
   *  /tags/relation/topfive/{tag}:
   *    get:
   *      tags:
   *      - tag
   *      description: 해당 태그와 같이 많이 사용된 태그 상위 5개
   *      parameters:
   *      - name: tag
   *        in: path
   *        type: integer   
   *        description: tag pk
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.get('/tags/relation/topfive/:tag', function(req, res) {
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
                  SELECT
                    A.HASHTAG AS PK
                    ,B.TITLE AS TITLE
                    ,COUNT(*) AS COUNT
                  FROM
                    HASHTAG AS A
                      LEFT OUTER JOIN TAG AS B ON A.HASHTAG = B.PK
                  WHERE
                    A.CONTENT IN (
                            SELECT
                              H.CONTENT
                            FROM
                              HASHTAG AS H
                            WHERE
                              H.HASHTAG = ${req.params.tag})
                    AND A.HASHTAG != ${req.params.tag}
                  GROUP BY A.HASHTAG
                  LIMIT 0,5
                  `;
        connection.query(sql, function(err, rows, fields) {
          // console.log(rows);
          if (!err) {
            serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
            res.json({status: "success", data: rows});
          } else {
            // console.log('Error while performing Query.', err);
            serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
            res.send({status:"fail", data: err});
          }
        });
      }
    });
  });

};
module.exports = initializeEndpoints;
