var mysql_dbc = require('../db/db_con.js')();
var connection = mysql_dbc.init();
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
const TRUE = 1;
const FALSE = 0;
const TAG_PER_PAGE = 12;
const initializeEndpoints = (app) => {
  /**
   * @swagger
   *  /tags:
   *    post:
   *      tags:
   *      - tag
   *      description: 하나의 태그를 작성, 이름이 정확히 일치할 경우 생성하지 않음
   *      parameters:
   *      - in: query
   *        name: title
   *        type: string
   *        description: 태그명
   *      - in: query
   *        name: body
   *        type: string
   *        description: 태그의 내용 및 설명
   *      - in: query
   *        name: user_id
   *        type: integer
   *        description: 작성자의 user id값
   *      - in: header
   *        name: user_token
   *        type: string
   *        description: 사용자의 token 값
   *      responses:
   *        200:
   */
  app.post('/tags', function(req, res) {
    var i = req.query;
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        sql =
              `
                SELECT   COUNT( PK ) AS COUNT
                FROM     TAG
                WHERE    TITLE LIKE '${i.title}'
              `;
        connection.query(sql, function(err, rows, fields) {
          if( rows[0].COUNT == 0 ){ // 작성된 topic이 없다면
            console.log(rows[0].COUNT);
            sql =
            `
              INSERT  INTO
              TAG     ( TITLE, BODY, CREATEDUSER, UPDATEDUSER )
              VALUES  ( ${"'"+i.title+"'"}, ${"'"+i.body+"'"}, ${i.user_id}, ${i.user_id} )
            `;
            connection.query(sql, function(err, rows, fields) {
              if(!err){
                res.send({status: "success"});
              }else{
                res.send({status: "fail"});
              }
            });
          }else{
            res.send({status: "fail"});
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
   *        in: query
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.get('/tags', function(req, res) {
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "SELECT * FROM tag";
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
      if (err) res.status(401).send({
        error: 'invalid token'
      });
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
                res.send({status: "success",data:rows[0]});
              }else{
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
   *        in: query
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.put('/tags/:id', function(req, res) {
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "UPDATE tag SET body = ?, updatedUser = ? WHERE pk = ?";
        var params = [req.query.body, req.query.user_id, req.params.id];
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
   *        in: query
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.delete('/tags/:id', function(req, res) {
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "DELETE FROM tag WHERE pk = ?";
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
      if (err) res.status(401).send({
        error: 'invalid token'
      });
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
          sql =
                    `
                      SELECT	  	T.PK
                        		 	 ,	T.TITLE
                        		 	 ,	T.BODY
                      FROM 			  TAG AS T
                      WHERE			  T.IS_REMOVED = ${FALSE}
                      ORDER BY 	  T.PK ASC
                      LIMIT 		  ${(req.params.page-1)*TAG_PER_PAGE}, ${TAG_PER_PAGE}
                    `;
          connection.query(sql, function(err, rows, fields) {
            if (!err){
              res.send({status: "success", data: rows, maxPage:totalPage});
            }else{
              res.send({status: "fail"});
            }
          });
        });
      }
    });
  });

};
module.exports = initializeEndpoints;
