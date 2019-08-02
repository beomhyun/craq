var mysql_dbc = require('../db/db_con.js')();
var connection = mysql_dbc.init();
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
const multer = require('multer');
const path = require("path");
const TRUE = 1;

let storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "image/contents/")
  },
  filename: function(req, file, callback) {
    callback(null, new Date().valueOf() + path.extname(file.originalname));
  }
});
const upload = multer({
  storage
});

const initializeEndpoints = (app) => {
  /**
   * @swagger
   *  /contents:
   *    post:
   *      tags:
   *      - content
   *      description: content를 작성
   *      parameters:
   *      - in: query
   *        name: topic_id
   *        type: integer
   *        description: topic의 id 값
   *      - in: query
   *        name: article_id
   *        type: integer
   *        description: 최초 작성 시에 질문인지, 답변 글인지 넣어줄 값
   *      - in: query
   *        name: beforeContent
   *        type: integer
   *        description: 작성하기 전에 참고할 content id값
   *      - in: query
   *        name: title
   *        type: string
   *        description: content에 넣을 title
   *      - in: query
   *        name: body
   *        type: string
   *        description: content에 넣을 body
   *      - in: formData
   *        name: image
   *        type: file
   *        description: content에 넣을 image
   *      - in: query
   *        name: user_id
   *        type: integer
   *        description: 작성자의 user id값
   *      - in: header
   *        name: user_token
   *        type: string
   *        description: 작성자의 token값
   *      responses:
   *        200:
   */
  app.post('/contents', upload.single('image'), function(req, res) {
    var i = req.query;
    var sql = "";
    function post_notice(req,i){
      // 작성한 글이 어느 질문에 대한 답변일 때
      if( i.topic_id == 1 && i.article_id != 0){ // 질문 글이면서
        // 질문 글의 작성자를 얻어온다
        sql =
              `
                SELECT    A.CREATEDUSER
                        , C.TITLE
                FROM      ARTICLE AS A
                JOIN      CONTENT AS C
                ON        A.CONTENT = C.PK
                WHERE     PK = ${i.article_id}
              `;
        connection.query(sql, function(err, rows, fields) {
          console.log(rows);
          var created_user = rows[0].CREATEDUSER;
          var title = row[0].TITLE;
          // 질문 작성자에게 답변이 달렸음을 알려주는 알림정보를 추가한다.
          var msg = `${title} 글에 답변이 달렸습니다`;
          sql =
                `
                  INSERT  INTO
                  NOTICE  ( USER, TYPE, BODY )
                  VALUES  ( ${created_user}, 1, ${msg} )
                `;
          connection.query(sql, function(err, rows, fields) {
            if (!err){
              res.send({status: "success2"});
            }else{
              res.send({status: "fail4"});
            }
          });
        });
      }
    }

    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        if (i.beforeContent == 0) {
          // 이전에 작성한 content가 없는 최초의 article 작성일 때
          sql =
          `
            INSERT    INTO
            CONTENT   ( TITLE, BODY, IMAGE, CREATEDUSER, UPDATEDUSER )
            VALUES    ( ${"'"+i.title+"'"}, ${"'"+i.body+"'"}, ${"'"+req.file.filename+"'"}, ${i.user_id}, ${i.user_id} )
          `;
          connection.query(sql, function(err, rows, fields) {
            if (!err) {
              var contentId = rows.insertId;
              sql =
                    `
                      INSERT    INTO
                      ARTICLE   ( TOPIC, ARTICLE, CONTENT, CREATEDUSER, UPDATEDUSER )
                      VALUES    ( ${i.topic_id}, ${i.article_id}, ${contentId}, ${i.user_id}, ${i.user_id} )
                    `;
              connection.query(sql, function(err, rows, fields) {
                if (!err) {
                  //console.log("rows.insertId = " + rows.insertId);
                  //생성한 article에 작성한 content id를 입력해준다.
                  sql =
                        `
                          UPDATE  CONTENT
                          SET     ARTICLE = ${rows.insertId}
                          WHERE   PK      = ${contentId}
                        `;
                  connection.query(sql, function(err, rows, fields) {
                    if (!err){
                      console.log("insert finish!!");
                      post_notice(req,i);
                      res.send({status: "success"});
                    }else{
                      res.send({status: "fail1"});
                    }
                  });
                } else {
                  res.send({status: "fail2"});
                }
              });
            } else {
              res.send({status: "fail3"});
            }
          });
        } else {
          // 이전에 작성한 content가 있고 기존의 article이 존재할 때
          sql =
                `
                  INSERT    INTO
                  CONTENT   ( ARTICLE, BEFORECONTENT, TITLE, BODY, IMAGE, CREATEDUSER, UPDATEDUSER )
                  VALUES    ( ${i.article_id}, ${i.beforeContent}, ${i.title}, ${i.body}, ${"'"+req.file.filename+"'"},${i.user_id},${i.user_id})
                `;
          connection.query(sql, function(err, rows, fields) {
            if (!err) {
              // 기존 article의 content 값을 추가한 contetn id값으로 변경, updatedUser 수정
              sql =
                    `
                      UPDATE    ARTICLE
                      SET       CONTENT       = ${rows.insertId}
                              , UPDATEDUSER   = ${i.user_id}
                      WHERE     PK            = ${i.article_id}
                    `;

              connection.query(sql, function(err, rows, fields) {
                if (!err){
                  res.send({status: "success"});
                }else{
                  res.send({status: "fail1"});
                }
              });
            }else{
              res.send({status: "fail1"});
            }
          });
        }
      }
    });
  });

  /**
   * @swagger
   *  /contents/content-image/{pk}:
   *    get:
   *      tags:
   *      - content
   *      description: 해당 content의 이미지를 가져옴.
   *      responses:
   *       200:
   *      parameters:
   *       - in: path
   *         name: pk
   *         type: integer
   *         description: 사용자 pk 전달
   */
  app.get('/contents/content-image/:pk', function(req, res) {
    var sql = " select count(*) as cheking, image from content where pk = ? ";
    var params = [req.params.pk];
    connection.query(sql, params, function(err, rows, fields) {
      if (!err) {
        var img = '<img src="/' + rows[0].image + '">';
        res.send(img);
      } else {
        res.send({
          status: "fail"
        });
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
    const ARTICLE_PER_PAGE = 20;
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        /*
            content의 정보를 받아오기 전에
            해당 content를 포함하는 article이
            목록으로 나열했을 때 위치하는 페이지 값과(page)
            페이지 최대 값(maxPage)을 계산하여
            두번째 쿼리 실행후 res에 data에 추가하여 같이 보낸다.
        */
        var sql = `
                    SELECT 	B.ROWNUM
                    FROM	(
                    				SELECT 	ROW_NUMBER() OVER(ORDER BY A.PK DESC)
                    			  				AS ROWNUM
                    			 			  ,	A.PK
                    				FROM		ARTICLE AS A
                    				JOIN		CONTENT AS C
                    				ON			A.CONTENT = C.PK
                    				WHERE 	A.IS_REMOVED = 0
                    			) AS B
                    WHERE 	B.PK =
                    			(
                    				SELECT 	ARTICLE
                    				FROM		CONTENT
                    				WHERE		PK = ${req.params.id}
                    			)
                  `;
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            var rowNum = rows[0].ROWNUM;
            var nowPage = rowNum / ARTICLE_PER_PAGE;
            if (rowNum % ARTICLE_PER_PAGE != 0) {
              nowPage++;
            }
            nowPage = parseInt(nowPage);

            // rowNum을 카운트하여 게시판의 글 개수를 구한 후
            // 계산하여 maxPage값도 구한다.
            sql = `
                    SELECT 	  COUNT(B.ROWNUM) AS COUNT
                    FROM		(
                              SELECT 	ROW_NUMBER() OVER(ORDER BY A.PK DESC)
                                      AS ROWNUM
                                  ,	A.PK
                              FROM		ARTICLE AS A
                              JOIN		CONTENT AS C
                              ON			A.CONTENT = C.PK
                              WHERE 	A.IS_REMOVED = 0
                            ) AS B
                  `;
            connection.query(sql, function(err, rows, fields) {
              if (!err) {
                var count = rows[0].COUNT;
                var maxPage = count / ARTICLE_PER_PAGE;
                if (count % ARTICLE_PER_PAGE != 0) {
                  maxPage++;
                }
                maxPage = parseInt(maxPage);

                sql = `SELECT * FROM CONTENT WHERE PK = ${req.params.id}`;
                connection.query(sql, function(err, rows, fields) {
                  if (!err) {
                    res.send({
                      status: "success",
                      data: rows[0],
                      nowPage: nowPage,
                      maxPage: maxPage
                    });
                  } else {
                    res.send({
                      status: "fail"
                    });
                  }
                });
              } else {
                res.send({
                  status: "fail"
                });
              }
            });

          } else {
            console.log('SELECT ROWNUM err ', err);
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
        var params = [req.query.title, req.query.body, req.query.image, req.params.id];
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
