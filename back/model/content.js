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
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "SELECT * FROM content WHERE pk = ?";
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
