var mysql_dbc = require('../db/db_con.js')();
var connection = mysql_dbc.init();
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
const multer = require('multer');
const path = require("path");
const TRUE = 1;
const serverlog = require('./serverlog.js');

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
   *  /contents/images:
   *    post:
   *      tags:
   *      - content
   *      description: 해당 content의 이미지를 저장
   *      parameters:
   *      - in: formData
   *        name: image
   *        type: file
   *        description: content에 넣을 image
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달.
   *      responses:
   *       200:
   */
  app.post('/contents/images', upload.single('image'), function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
        res.status(401).send({
          error: 'invalid token'
        });
      } else {
        var filename = "default_image.png";
        if (req.file) { // 이미지 파일이 첨부되었을 때
          filename = req.file.filename;
        }
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
        res.send({
          status: "success",
          data: req.file.filename
        });
      }
    });
  });

  /**
   * @swagger
   *  /contents:
   *    post:
   *      tags:
   *      - content
   *      description: content를 작성, 질문&작성글일 땐 topic = 1 이며 , 질문글을 작성할 때는 article_id = 0
   *                   답변글 작성일 때는 article_id !=0 최초 작성일 떄는 beforeContent = 0
   *      parameters:
   *      - in: body
   *        name: contentsbody
   *        schema:
   *          type: object
   *          properties:
   *            topic_id:
   *              type: integer
   *            article_id:
   *              type: integer
   *            beforeContent:
   *              type: integer
   *            title:
   *              type: string
   *            body:
   *              type: string
   *            user_id:
   *              type: integer
   *            image:
   *              type: string
   *            tags:
   *              type: string
   *      - in: header
   *        name: user_token
   *        type: string
   *        description: 작성자의 token값
   *      responses:
   *        200:
   */
  app.post('/contents', function(req, res) {
    var i = req.body;
    var sql = "";
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({ error: 'invalid token' });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
        if (i.beforeContent == 0) { // 이전에 작성한 content가 없는 최초의 article 작성일 때
          sql =
          `
          INSERT    INTO
          CONTENT   (TITLE,BODY,IMAGE,CREATEDUSER,UPDATEDUSER)
          VALUES    ('${i.title}','${i.body}','${i.image}',${i.user_id},${i.user_id})
          `;
          connection.query(sql, function(err, rows, fields) {
            if (!err) {
              var contentId = rows.insertId; // 방금 생성된 content의 id값
              sql =
              `
              INSERT    INTO
              ARTICLE   (TOPIC,ARTICLE,CONTENT,CREATEDUSER,UPDATEDUSER)
              VALUES    (${i.topic_id},${i.article_id},${contentId},${i.user_id},${i.user_id})
              `;
              connection.query(sql, function(err, rows, fields) {
                if (!err) {
                  var articleId = rows.insertId; // 방금 생성된 article의 id값
                  sql = // 방금 생성된 article의 id값으로 갱신시켜준다.
                  `
                  UPDATE  CONTENT
                  SET     ARTICLE = ${articleId}
                  WHERE   PK      = ${contentId}
                  `;
                  connection.query(sql, function(err, rows, fields) {
                    if (!err) {
                      if (i.topic_id == 1 && i.article_id != 0) { // 작성한 aticle이 답변 형식일때
                        sql =
                        `
                        SELECT	 A.PK      AS QUESTION_PK
                          		 , A.CONTENT AS QUESTION_CONTENT
                          		 , C.TITLE
                          		 , A.CREATEDUSER
                          		 , (
                            		 	SELECT	USERNAME
                            		 	FROM 		USER
                            		 	WHERE 	PK = A.CREATEDUSER
                          		 ) USERNAME
                        FROM 		ARTICLE A
                        JOIN 		CONTENT C
                        ON 		  A.CONTENT    = C.PK
                        WHERE   A.PK         = ${i.article_id}
                        `;  // 질문글의 작성자를 얻어옴
                        connection.query(sql, function(err, rows, fields) {

                          if(!rows){
                            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                            res.send({status:"fail"});
                          }else{
                            var title = rows[0].TITLE.substring(0,10);
                            var msg = `${title} 글에 답변이 달렸습니다`; // 질문 작성자에게 답변이 달렸음을 알려주는 알림정보를 추가한다.
                            var qst_pk = rows[0].QUESTION_PK;
                            var qst_content = rows[0].QUESTION_CONTENT;
                            var info = `{"question_pk":${qst_pk}, "question_content":${qst_content}, "answer_pk":${articleId}, "answer_content":${contentId}}`;

                            sql =
                            `
                            INSERT  INTO
                            NOTICE  (USER,TYPE,BODY,INFO)
                            VALUES  (${rows[0].CREATEDUSER},1,'${msg}','${info}')
                            `;
                            connection.query(sql, function(err, rows, fields) {

                              if (!err) {
                                sql = // 답변을 작성한 직후에 질문 article에 와드를 설정한 사용자들의 수를 구한다.
                            `
                            SELECT  COUNT(*) COUNT
                            FROM    WARD
                            WHERE   ARTICLE    = ${qst_pk}
                            AND     IS_REMOVED = 0
                            `;
                            connection.query(sql, function(err, rows, fields) {
                              if (!err) {
                                if(rows[0].COUNT > 0){
                                  sql =
                                  `
                                  SELECT  USER
                                  FROM    WARD
                                  WHERE   ARTICLE    = ${qst_pk}
                                  AND     IS_REMOVED = 0
                                  `;
                                  connection.query(sql, function(err, rows, fields) {
                                    if (!err) {
                                      for (var i = 0; i < rows.length; i++) { // 와드를 설정한 사용자들에게 알림을 보낸다.
                                        sql =
                                        `
                                        INSERT  INTO
                                        NOTICE  (USER,TYPE,BODY,INFO)
                                        VALUES  (${rows[i].USER},1,'${msg}','${info}')
                                        `;
                                        connection.query(sql, function(err, rows, fields) {
                                          if (!err) {
                                            serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
                                          } else {
                                            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                                          }
                                        });
                                      }
                                      serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
                                      res.send({ status: "success",ARTICLEPK:articleId,CONTENTPK:contentId, msg: "insert notice2"});
                                    } else {
                                      serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                                      res.send({ status: "fail", msg: "select user err" });
                                    }
                                  });
                                }else{
                                  serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
                                  res.send({ status: "success",ARTICLEPK:articleId,CONTENTPK:contentId});
                                }
                              }else{
                                serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                                res.send({ status: "fail"});
                              }
                            });
                              } else {
                                serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                              }
                            });
                            
                           }
                         });
                       }else{
                        async function replaceAll(str, searchStr, replaceStr) {
                          return await str.split(searchStr).join(replaceStr);
                        }
                        async function toArray(tags, createdUser, contentId) {
                          tags = await replaceAll(tags, '[', '');
                          tags = await replaceAll(tags, ']', '');
                          tags = await replaceAll(tags, ' ', '');
                          var arr = await tags.split(',');
                          for (var i in arr) {
                            var sql = await `
                            INSERT  INTO
                            HASHTAG  ( CONTENT, HASHTAG , CREATEDUSER, UPDATEDUSER )
                            VALUES
                            `;
                            sql += await ` (${contentId}, ${arr[i]}, ${createdUser}, ${createdUser})`;
                            await connection.query(sql, function(err, rows, fields) {
                              if (!err) {
                                // console.log("tag add successs");
                              } else {
                                // console.log("tag add fail");
                              }
                            });
                          }
                          serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
                          res.send({ status: "success",ARTICLEPK:articleId,CONTENTPK:contentId});
                        }
                        toArray(i.tags, decoded.pk, contentId);
                       }
                       
                     }else{
                       serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                       res.send({ status: "fail", msg: "update content err" });
                     }
                   });
                 }else{
                   serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                   res.send({ status: "fail", msg: "insert article err" });
                 }
               });
             }
           });
         } else { // 이전에 작성한 article이 존재할 때

          var version = 1;
          sql =
          `
          SELECT  COUNT(*) AS C
                  ,ARTICLE
          FROM    CONTENT
          WHERE   1 = 1
          AND     ARTICLE =
                  (
      							SELECT	ARTICLE
      							FROM 		CONTENT
      							WHERE 	PK = ${i.beforeContent}
                  )
          `;
          connection.query(sql, function(err, rows, fields) {
            if (!err) {
              version = rows[0].C + 1;
              var articleId = rows[0].ARTICLE;
              sql =
              `
              INSERT    INTO
              CONTENT
              (         ARTICLE,
                        BEFORECONTENT,
                        TITLE ,
                        BODY ,
                        IMAGE,
                        CREATEDUSER,
                        UPDATEDUSER ,
                        VERSION
              )
              VALUES
              (
                        (
                            SELECT  ARTICLE
                            FROM    CONTENT AS C
                            WHERE   C.PK = ${i.beforeContent}
                        ),
                         ${i.beforeContent},
                        '${i.title}',
                        '${i.body}',
                        '${i.image}',
                         ${i.user_id},
                         ${i.user_id},
                         ${version}
              )
              `;
              connection.query(sql, function(err, rows, fields) {
                var contentId = rows.insertId;  // 방금 생성한 content의 pk값
                if (!err) { 
                  sql = // 방금 생성된 article의 id값으로 갱신시켜준다.
                  `
                  UPDATE  ARTICLE
                  SET     CONTENT = ${contentId}
                  WHERE   PK      = ${articleId}
                  `;

                  connection.query(sql, function(err, rows, fields) {
                    if (!err) {
                      if (i.topic_id == 1 && i.article_id != 0) { // 작성한 article이 답변형식일 때
                        sql =   // 질문 article의 작성자와 제목을 구한다.
                        `
                        SELECT	 A.PK      AS QUESTION_PK
                               , A.CONTENT AS QUESTION_CONTENT
                               , C.TITLE
                               , A.CREATEDUSER
                               , (
                                  SELECT	USERNAME
                                  FROM 		USER
                                  WHERE 	PK = A.CREATEDUSER
                               ) USERNAME
                               , (
                                 SELECT   ARTICLE
                                 FROM     CONTENT
                                 WHERE    PK = ${i.beforeContent}
                               ) ANS_PK
                        FROM 		ARTICLE A
                        JOIN 		CONTENT C
                        ON 		  A.CONTENT    = C.PK
                        WHERE   A.PK         = ${i.article_id}
                        `;
                        connection.query(sql, function(err, rows, fields) {
                          var title = rows[0].TITLE.substring(0,10);
                          var msg = `"${title}.." 글에 답변이 달렸습니다`; // 질문 작성자에게 답변이 달렸음을 알려주는 알림정보를 추가한다.
                          var qst_pk = rows[0].QUESTION_PK;
                          var qst_content = rows[0].QUESTION_CONTENT;
                          var ans_pk = rows[0].ANS_PK;
                          var info = `{"question_pk":${qst_pk}, "question_content":${qst_content}, "answer_pk":${ans_pk}, "answer_content":${contentId}}`;
                          sql =
                          `
                          INSERT  INTO
                          NOTICE  (USER,TYPE,BODY,INFO)
                          VALUES  (${rows[0].CREATEDUSER},1,'${msg}','${info}')
                          `;
                          connection.query(sql, function(err, rows, fields) {
                            if (!err) {
                              serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
                            } else {
                              serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                            }
                          });
    
                          sql = // 답변을 작성한 직후에 와드를 설정한 사용자들의 수를 구한다.
                          `
                          SELECT  COUNT(*) COUNT
                          FROM    WARD
                          WHERE   ARTICLE     =   ${qst_pk}
                          AND     IS_REMOVED  =   0
                          `;
                          connection.query(sql, function(err, rows, fields) {
                            if (!err) {
                              if(rows[0].COUNT > 0){
                                sql =
                                `
                                SELECT  USER
                                FROM    WARD
                                WHERE   ARTICLE     =  ${qst_pk}
                                AND     IS_REMOVED  =  0
                                `;
                                connection.query(sql, function(err, rows, fields) {
                                  if (!err) {
                                    for (var i = 0; i < rows.length; i++) {
                                      sql =
                                      `
                                      INSERT  INTO
                                      NOTICE  (USER,TYPE,BODY,INFO)
                                      VALUES  (${rows[i].USER},1,'${msg}','${info}')
                                      `;
                                      connection.query(sql, function(err, rows, fields) {
                                        if (!err) {
                                          serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
                                        } else {
                                          serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                                        }
                                      });
                                    }
                                    serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
                                    res.send({ status: "success",ARTICLEPK: articleId,CONTENTPK:contentId, msg: "insert notice" });
                                  } else {
                                    serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                                    res.send({ status: "fail", msg: "select user err" });
                                  }
                                });
                              }else {
                                serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
                                res.send({ status: "success",ARTICLEPK: articleId,CONTENTPK:contentId, msg: "insert notice" });
                              }

                            } else {
                              serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                              res.send({ status: "fail", msg: "select count user err" });
                            }
                          });
                        });
                      } else {
                        async function replaceAll(str, searchStr, replaceStr) {
                          return await str.split(searchStr).join(replaceStr);
                        }
                        async function toArray(tags, createdUser, contentId) {
                          tags = await replaceAll(tags, '[', '');
                          tags = await replaceAll(tags, ']', '');
                          tags = await replaceAll(tags, ' ', '');
                          var arr = await tags.split(',');
                          for (var i in arr) {
                            var sql = await `
                            INSERT  INTO
                            HASHTAG  ( CONTENT, HASHTAG , CREATEDUSER, UPDATEDUSER )
                            VALUES
                            `;
                            sql += await ` (${contentId}, ${arr[i]}, ${createdUser}, ${createdUser})`;
                            await connection.query(sql, function(err, rows, fields) {
                              if (!err) {
                                // console.log("tag add successs");
                              } else {
                                // console.log("tag add fail");
                              }
                            });
                          }
                          serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
                          res.send({ status: "success",ARTICLEPK: articleId,CONTENTPK:contentId });
                        }
                        toArray(i.tags, decoded.pk, contentId);

                      }
                    } else {
                      serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                      res.send({ status: "fail1" });
                    }
                  });
                } else {
                  serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                  res.send({ status: "fail1" });
                }
              });
            } else {
              serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
              res.send({
                status: "fail",
                msg: "select count version err"
              })
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
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달.
   *      - in: path
   *        name: pk
   *        type: integer
   *        description: 사용자 pk 전달
   */
  app.get('/contents/content-image/:pk', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
        res.status(401).send({
          error: 'invalid token'
        });
      } else {
        var sql = " select count(*) as cheking, image from content where pk = ? ";
        var params = [req.params.pk];
        connection.query(sql, params, function(err, rows, fields) {
          if (!err) {
            var img = '<img src="/' + rows[0].image + '">';
            res.send(img);
            serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
          } else {
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
            res.send({
              status: "fail"
            });
          }
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
   *        in: header
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/contents/articles/:id', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
        var sql =
          `
                    SELECT	PK
                          ,(
                            SELECT
                              U.USERNAME
                            FROM
                              USER AS U
                            WHERE
                              C.CREATEDUSER = U.PK
                          ) AS USERNAME
                          , TITLE
                    		  , BODY
                    	    , CONCAT("http://192.168.31.58:10123/",IMAGE) AS IMAGE
                    	    , (
                      		 	SELECT	USERNAME
                      		 	FROM 		USER
                      		 	WHERE 	PK = C.CREATEDUSER
                      		 ) USERNAME
                      		 , (
                      		 	SELECT 	SUM(GOOD)
                      		 	FROM 		VOTE
                      		 	WHERE 	ARTICLE = ${req.params.id}
                      		 ) VOTE
                      		 , (
                      		 	SELECT 	COUNT(ARTICLE)
                      		 	FROM 		VIEW
                      		 	WHERE 	ARTICLE = ${req.params.id}
                      		 ) VIEW
                           , (
                             SELECT   CREATED_AT
                             FROM     ARTICLE
                             WHERE    PK = ${req.params.id}
                           ) CREATED_AT
                    FROM 		CONTENT C
                    WHERE 	ARTICLE = ${req.params.id}
                    AND 		IS_REMOVED = 0
                  `;
        connection.query(sql, function(err, rows, fields) {
          if (!err) {

            sql = `
            INSERT INTO
            VIEW (ARTICLE, USER)
            VALUES (${req.params.id},${decoded.pk})
            `;
            connection.query(sql, function(err, answers, fields) {
              if (!err) {
                serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
                res.send({
                  status: "success",
                  data: rows
                });
              } else {
                serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                res.send({
                  status: "success",
                  data: rows
                });
              }
            });
          } else {
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
            res.send({
              status: "fail1"
            });
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
   *        in: header
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/contents/last/articles/:id', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
        var sql = "SELECT * FROM content WHERE article = ? ORDER BY pk DESC limit 1";
        var params = [req.params.id];
        connection.query(sql, params, function(err, rows, fields) {
          if (!err) {
            serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
            res.json(rows);
          } else {
            console.log('article insert err ', err);
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
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
   *        in: header
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/contents/:id', function(req, res) {
    const ARTICLE_PER_PAGE = 20;
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
        /*
            content의 정보를 받아오기 전에
            해당 content를 포함하는 article이
            목록으로 나열했을 때 위치하는 페이지 값과(page)
            페이지 최대 값(maxPage)을 계산하여
            두번째 쿼리 실행후 res에 data에 추가하여 같이 보낸다.
        */
        var sql = `
                    SELECT
                          COUNT(*) AS TMP
                          ,B.ROWNUM
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
                    serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
                    res.send({
                      status: "success",
                      data: rows[0],
                      nowPage: nowPage,
                      maxPage: maxPage
                    });
                  } else {
                    serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                    res.send({
                      status: "fail"
                    });
                  }
                });
              } else {
                serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                res.send({
                  status: "fail"
                });
              }
            });

          } else {
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
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
   *      - in: body
   *        name: user
   *        description: user_info
   *        schema:
   *          type: object
   *          properties:
   *            id:
   *              type: integer
   *            title:
   *              type: string
   *            body:
   *              type: string
   *            image:
   *              type: string
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달.
   *      responses:
   *        200:
   */
  app.put('/contents/:id', function(req, res) {
    var i = req.body;
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
        var sql =
          `
          UPDATE  CONTENT
          SET     TITLE   = '${i.title}'
                , BODY    = '${i.body}'
                , IMAGE   = '${i.image}'
          WHERE   PK      = ${i.id}
        `;
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
            res.json(rows);
          } else {
            console.log('article insert err ', err);
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
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
   *        in: header
   *        type: string
   *        description: 사용자의 token값을 전달.
   *      responses:
   *        200:
   */
  app.delete('/contents/:id', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
        var sql = `UPDATE content SET is_removed = ${TRUE} WHERE pk = ?`;
        var params = req.params.id;
        connection.query(sql, params, function(err, rows, fields) {
          if (!err) {
            serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
            res.json(rows);
          } else {
            console.log('article insert err ', err);
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
            res.send(err);
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /contents/notices:
   *    post:
   *      tags:
   *      - content
   *      description: 게시판관리자가 공지사항을 작성함.
   *      parameters:
   *      - in: body
   *        name: noticeInfo
   *        schema:
   *          type: object
   *          properties:
   *            topic_id:
   *              type: integer
   *            user_id:
   *              type: integer
   *            title:
   *              type: string
   *            body:
   *              type: string
   *            image:
   *              type: string
   *      - in: header
   *        name: user_token
   *        type: string
   *        description: 작성자의 token값
   *      responses:
   *        200:
   */

  app.post('/contents/notices', function(req, res) {
    var i = req.body;
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'invalid token'
        });
        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
      } else {
        var sql =
          `
           SELECT	  COUNT(*) TMP
           FROM 		MANAGER
           WHERE		TOPIC = ${i.topic_id}
           AND      USER  = ${i.user_id}
         `;
        connection.query(sql, function(err, rows, fields) {
          if (!err && rows[0].TMP == 1) { // 해당 게시판의 관리자일 때
            sql =
              `
               INSERT   INTO
               CONTENT  (TITLE, BODY, IMAGE, CREATEDUSER)
               VALUES   ('${i.title}','${i.body}','${i.image}',${i.user_id})
             `;
            connection.query(sql, function(err, rows, fields) {

              if (!err) {
                var contentId = rows.insertId; // 방금 생성된 content의 id값
                sql =
                `
                INSERT    INTO
                ARTICLE   (TOPIC,ARTICLE,CONTENT,CREATEDUSER,UPDATEDUSER,IS_ACTIVE)
                VALUES    (${i.topic_id},0,${contentId},${i.user_id},${i.user_id},1)
                `;
                connection.query(sql, function(err, rows, fields) {

                  if(!err){
                    var articleId = rows.insertId; // 방금 생성된 article의 id값
                    sql = // 방금 생성된 article의 id값으로 갱신시켜준다.
                      `
                    UPDATE  CONTENT
                    SET     ARTICLE = ${articleId}
                    WHERE   PK      = ${contentId}
                    `;
                    connection.query(sql, function(err, rows, fields) {

                      if(!err){
                        serverlog.log(connection, decoded.pk, this.sql, "success", req.connection.remoteAddress);
                        res.send({
                          status: "success"
                        });
                      }else{
                        serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                        res.send({
                          status: "fail"
                        });
                      }
                    });
                  }else{
                    serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                    res.send({
                      status: "fail"
                    });
                  }
                });
              } else {
                serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
                res.send({
                  status: "fail"
                });
              }
            });

          } else {
            serverlog.log(connection, decoded.pk, this.sql, "fail", req.connection.remoteAddress);
            res.send({
              status: "fail"
            });
          }
        });
      }
    });
  });

};
module.exports = initializeEndpoints;
