var mysql_dbc = require('../db/db_con.js')();
var connection = mysql_dbc.init();
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
const multer = require('multer');
const path = require("path");
const TRUE = 1;
​
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
​
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
   *      - in: query
   *        name: user_token
   *        type: string
   *        description: 작성자의 token값
   *      responses:
   *        200:
   */
  app.post('/contents', upload.single('image'), function(req, res) {
    var i = req.query;
    var sql = "";
    var params = [];
    jwt.verify(i.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        if (i.beforeContent == 0) { // 이전에 작성한 content가 없는 최초의 article 작성일 때
          sql = "INSERT INTO content(title,body,image,createdUser,updatedUser) VALUES(?,?,?,?,?)";
          params = [i.title, i.body, i.image, i.user_id, i.user_id];
          connection.query(sql, params, function(err, rows, fields) {
            if (!err) {
              var contentId = rows.insertId;
              sql = "INSERT INTO article(topic,article,content,createdUser,updatedUser) VALUES(?,?,?,?,?)"
              params = [i.topic_id, i.article_id, contentId, i.user_id, i.user_id];
              connection.query(sql, params, function(err, rows, fields) {
                if (!err) {
                  console.log("rows.insertId = " + rows.insertId);
                  sql = `UPDATE CONTENT SET ARTICLE = ${rows.insertId} WHERE pk = ${contentId}`;
                  connection.query(sql, params, function(err, rows, fields) {
                    if (!err) {
                      res.json(rows);
                    } else {
                      console.log('content update err.', err);
                      res.send(err);
                    }
                  });
                } else {
                  console.log('Error while performing Query.', err);
                  res.send(err);
                }
              });
            } else {
              console.log('Error while performing Query.', err);
              res.send(err);
            }
          });
        } else { // 이전에 작성한 content가 있고 기존의 article이 존재할 때
          sql = "INSERT INTO content(Article,beforeContent,title,body,image,createdUser,updatedUser) VALUES(?,?,?,?,?,?,?)";
          params = [i.article_id, i.beforeContent, i.title, i.body, req.file.filename, i.user_id, i.user_id];
          connection.query(sql, params, function(err, rows, fields) {
            if (!err) {
              // 기존 article의 content 값을 추가한 contetn id값으로 변경, updatedUser 수정
              sql = "UPDATE article SET content = ?, updatedUser = ? WHERE pk = ?";
              params = [rows.insertId, i.user_id, i.article_id];
              connection.query(sql, params, function(err, rows, fields) {
                if (!err) {
                  res.json(rows);
                } else {
                  console.log('Error while performing Query.', err);
                  res.send(err);
                }
              });
            } else {
              console.log('Error while performing Query.', err);
              res.send(err);
            }
          });
        }
      }
    });
  });
​
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
​
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
​
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
​
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
​
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
​
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
​
          } else {
            console.log('SELECT ROWNUM err ', err);
            res.send(err);
          }
        });
      }
    });
  });
​
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
​
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
​
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
Collapse



new messages
article.js 
var mysql_dbc = require('../db/db_con.js')();
var connection = mysql_dbc.init();
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
const multer = require('multer');
const path = require("path");
const TRUE = 1;
const FALSE = 0;
const ARTICLE_PER_PAGE = 20;
const IS_QUESTION = 0;
​
let storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "upload/")
  },
  filename: function(req, file, callback) {
    callback(null, new Date().valueOf() + path.extname(file.originalname));
  }
});
const upload = multer({
  storage
});
​
const initializeEndpoints = (app) => {
  /**
   * @swagger
   *  /articles:
   *    get:
   *      tags:
   *      - article
   *      description: 모든 글을 받아옴.
   *      parameters:
   *      - name: user_token
   *        in: query
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/articles', function(req, res) {
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "SELECT * FROM article";
        connection.query(sql, function(err, rows, fields) {
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
​
  /**
   * @swagger
   *  /articles/questions:
   *    get:
   *      tags:
   *      - article
   *      description: 질문 형식의 글을 모두 받아옴.
   *      parameters:
   *      - name: user_token
   *        in: query
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/articles/questions', function(req, res) {
    const QA = 1;
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = `SELECT * FROM article WHERE topic = ${QA} AND article IS NULL`;
        connection.query(sql, function(err, rows, fields) {
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
​
  /**
   * @swagger
   *  /articles/answers:
   *    get:
   *      tags:
   *      - article
   *      description: 답변 형식의 글을 모두 받아옴.
   *      parameters:
   *      - name: user_token
   *        in: query
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/articles/answers', function(req, res) {
    const QA = 1;
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = `SELECT * FROM article WHERE topic = ${QA} AND article IS NOT NULL`;
        connection.query(sql, function(err, rows, fields) {
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
​
  /**
   * @swagger
   *  /articles/answers/questions/{id}:
   *    get:
   *      tags:
   *      - article
   *      description: 특정 질문의 답변들을 모두 받아옴.
   *      parameters:
   *      - name: id
   *        in: path
   *        type: integer
   *        description: 질문할 article의 id값 전달.
   *      - name: user_token
   *        in: query
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/articles/answers/questions/:id', function(req, res) {
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "SELECT * FROM article WHERE article = ?";
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
​
  /**
   * @swagger
   *  /articles/selections/questions/{id}:
   *    get:
   *      tags:
   *      - article
   *      description: 특정 질문의 채택된 답변을 가져옴.(1)
   *      parameters:
   *      - name: id
   *        in: path
   *        type: integer
   *        description: 질문할 article의 id값 전달.
   *      - name: user_token
   *        in: query
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/articles/selections/questions/:id', function(req, res) {
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "SELECT * FROM article WHERE pk = ( SELECT content FROM article WHERE pk = ?)"
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
​
  /**
   * @swagger
   *  /articles/{topic}/{page}:
   *    get:
   *      tags:
   *      - article
   *      description: page위치에 해당하는 특정 topic의 article들을 가져옴.
   *      parameters:
   *      - name: topic
   *        in: path
   *        type: integer
   *        description: topic의 id 값
   *      - name: page
   *        in: path
   *        type: integer
   *        description: article들을 가져올 page위치의 값
   *      - name: user_token
   *        in: query
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/articles/:topic/:page', function(req, res) {
    var sql = '';
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        sql = `SELECT COUNT(PK) AS TOTAL_ARTICLE FROM ARTICLE WHERE IS_REMOVED = ${FALSE} AND TOPIC = ${req.params.topic}`;
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            var totalArticle = rows[0].TOTAL_ARTICLE;
            //나올 수 있는 총 페이지의 수를 구한다.
            var totalPage = totalArticle / ARTICLE_PER_PAGE;
            if (totalArticle > totalPage * ARTICLE_PER_PAGE) {
              totalPage++;
            }
            sql = `SELECT B.ROWNUM, B.TOPIC, B.TITLE, B.CREATEDUSER, B.CREATED_AT FROM ( SELECT ROW_NUMBER() OVER( ORDER BY A.PK DESC ) AS ROWNUM, A.TOPIC, C.TITLE, C.CREATEDUSER, C.CREATED_AT, ( SELECT COUNT(ARTICLE) FROM VIEW WHERE ARTICLE = A.PK ) AS VIEW, ( SELECT SUM(GOOD) FROM VOTE WHERE ARTICLE = A.PK ) AS VOTE FROM ARTICLE AS A JOIN CONTENT AS C ON A.CONTENT = C.PK WHERE A.TOPIC = ${req.params.topic} AND A.IS_REMOVED = ${FALSE}) AS B WHERE ROWNUM >  ${ARTICLE_PER_PAGE}*(${req.params.page}-1) AND ROWNUM <= ${req.params.page}*${ARTICLE_PER_PAGE}`;
            connection.query(sql, function(err, rows, fields) {
              if (!err) {
                res.json(rows);
              } else {
                console.log('article insert err ', err);
                res.send(err);
              }
            });
          } else {
            console.log('article insert err ', err);
            res.send(err);
          }
        });
      }
    });
  });
​
  /**
   * @swagger
   *  /articles/news/{topic}/{limit}:
   *    get:
   *      tags:
   *      - article
   *      description: 특정 토픽의 최신 article들을 limit개 가져온다.
   *      parameters:
   *      - name: topic
   *        in: path
   *        type: integer
   *        description: 특정 topic의 id 값 (질문일 경우 1 입력)
   *      - name: limit
   *        in: path
   *        type: integer
   *        description: 최신 article들을 받아올 갯수
   *      - name: user_token
   *        in: query
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.get('/articles/news/:topic/:limit', function(req, res) {
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        sql = `SELECT ROW_NUMBER() OVER( ORDER BY A.PK DESC ) AS ROWNUM, A.TOPIC, C.TITLE, A.CREATEDUSER FROM ARTICLE AS A JOIN CONTENT AS C ON A.CONTENT = C.PK WHERE A.IS_REMOVED = ${FALSE} AND A.TOPIC = ${req.params.topic} LIMIT ${req.params.limit}`;
        connection.query(sql, function(err, rows, fields) {
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
​
  /**
   * @swagger
   *  /articles/{id}:
   *    put:
   *      tags:
   *      - article
   *      description: 특정글의 정보를 수정함.
   *      parameters:
   *      - name: id
   *        in: path
   *        type: integer
   *        description: 수정할 article의 id값 전달.
   *      - name: content_id
   *        in: query
   *        type: integer
   *        description: 채택할 또는 채택을 변경할 content의 id값을 전달.
   *      - name: user_token
   *        in: query
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.put('/articles/:id', function(req, res) {
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "UPDATE article SET content = ? WHERE pk = ?";
        var params = [req.query.content_id, req.params.id];
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
​
  /**
   * @swagger
   *  /articles/{id}:
   *    delete:
   *      tags:
   *      - article
   *      description: 특정글을 삭제함(flag처리)
   *      parameters:
   *      - name: id
   *        in: path
   *        type: integer
   *        description: 삭제할 article의 id값 전달.
   *      - name: user_token
   *        in: query
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.delete('/articles/:id', function(req, res) {
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = `UPDATE article SET is_removed = ${TRUE} WHERE pk = ?`;
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

  /**
  * @swagger
  *  /questions/{now_page}:
  *    get:
  *      tags:
  *      - article
  *      description: 질문게시판의 모든 질문글을 페이징해서 보여줌
  *      parameters:
  *      - name: now_page
  *        in: path
  *        type: integer
  *        description: 요청하는 페이지 값을 전달.
  *      - name: order_by
  *        in: query
  *        type: string
  *        description: 정렬할 기준을 전달.<br> VIEWS, HELPFUL, ANSWER, RELIABLE
  *      - name: user_token
  *        in: header
  *        type: string
  *        description: 사용자의 token 값을 전달.
  *      responses:
  *        200:
  */
 app.get('/questions/:now_page', function(req, res) {
   jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
     if (err) res.status(401).send({
       error: 'invalid token'
     });
     else {
       var perpage = 20;
       var page = (req.params.now_page-1)*perpage;
       // console.log(page);
       var sql = ` SELECT
       ASK.PK
       ,CON.TITLE
       ,CON.BODY
       ,ASK.CREATED_AT AS ASKED_TIME
       ,ANSWER.CREATED_AT AS ANSERD_TIME
       ,(SELECT
           GROUP_CONCAT(T.TITLE SEPARATOR ", ")
         FROM
           HASHTAG AS H
             LEFT OUTER JOIN TAG AS T ON H.HASHTAG = T.PK
         WHERE
           CON.PK = H.CONTENT) AS HASHTAG
       ,(SELECT
           COUNT(*)
         FROM
           VIEW AS V
         WHERE
           ASK.PK = V.ARTICLE) AS VIEWS
       ,(SELECT
           SUM(V.GOOD)
         FROM VOTE AS V
         WHERE ASK.PK = V.ARTICLE) AS HELPFUL
       ,U.PK AS ANSWER_USERPK
       ,U.USERNAME AS ANSWER_USERNAME
       ,(SELECT
           COUNT(*)
         FROM
           ARTICLE AS A
         WHERE
           A.ARTICLE != 0
           AND A.CREATEDUSER = U.PK
           AND A.IS_ACTIVE = 1) AS SELECTED_ANSWER
       , (SELECT
           COUNT(*)
         FROM
           ARTICLE AS A
         WHERE
           A.ARTICLE != 0
           AND A.CREATEDUSER = U.PK) AS ANSWER
       , ((SELECT
           COUNT(*)
         FROM
           ARTICLE AS A
         WHERE
           A.ARTICLE != 0
           AND A.CREATEDUSER = U.PK
           AND A.IS_ACTIVE = 1)/(SELECT
           COUNT(*)
         FROM
           ARTICLE AS A
         WHERE
           A.ARTICLE != 0
           AND A.CREATEDUSER = U.PK)) AS RELIABLE
   FROM
     ARTICLE AS ASK
         LEFT OUTER JOIN CONTENT AS CON ON ASK.CONTENT = CON.PK
           LEFT OUTER JOIN ARTICLE AS ANSWER ON ASK.ANSWER = ANSWER.PK
             LEFT OUTER JOIN USER AS U ON ANSWER.CREATEDUSER = U.PK
   WHERE 1=1
     AND CON.IS_REMOVED = 0
     AND ASK.ARTICLE = 0
       AND ASK.TOPIC = 1
   ORDER BY ${req.query.order_by} DESC
   LIMIT ${page}, ${perpage} `;
         // console.log(sql);
       connection.query(sql, function(err, rows, fields) {
         if (!err) {
           sql =  `select count(*) as total from article where topic = 1`
           connection.query(sql, function(err, rows2, fields) {
             if(!err){
               var max_page = rows2[0].total/perpage +1;
               res.json({status: "success", nowpage: req.params.now_page, max_page: parseInt(max_page), data: rows});
             }else{
               res.send({status: "fail", data: err});
             }
           });
         } else {
           console.log('article insert err ', err);
           res.send({status: "fail", data: err});
         }
       });
     }
   });
 });

};
module.exports = initializeEndpoints;