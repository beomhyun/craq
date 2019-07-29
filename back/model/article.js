var mysql_dbc = require('../db/db_con.js')();
var connection = mysql_dbc.init();
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
const multer = require('multer');
const path = require("path");
const TRUE = 1;

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
        connection.query(sql, params,function(err, rows, fields) {
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
        connection.query(sql, params,function(err, rows, fields) {
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
        var params = [req.query.content_id,req.params.id];
        connection.query(sql, params,function(err, rows, fields) {
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
   *  /articles/helpful/{user}/{article}:
   *    post:
   *      tags:
   *      - article
   *      description: 특정글의 helpful 정보를 수정함.
   *      parameters:
   *      - name: user
   *        in: path
   *        type: integer
   *        description: 추천한 유저의 id값 전달
   *      - name: article
   *        in: path
   *        type: integer
   *        description: 추천 받을 글의 id값 전달
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.post('/articles/helpful/:user/:article', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = " select count(*) checking, good from vote where article = ? and user = ? ";
        var params = [req.params.article,req.params.user];
        connection.query(sql, params,function(err, rows, fields) {
          if (!err) {
            if(rows[0].checking == 0){
              sql = " insert into vote(article, user, good) values(?,?,1) ";
              connection.query(sql, params,function(err, rows, fields) {
                if(!err){
                  res.send({status: "success"});
                }else{
                  res.send({status: "fail", data: err});
                }
              });

            }else if(good == -1){
              sql = " update vote set good = 1 where article = ? and user = ? ";
              connection.query(sql, params,function(err, rows, fields) {
                if(!err) res.send({status: "success"});
                else res.send({status: "fail", data: err});
              });
            }else{
              res.send({status: "fail", data: "alredy votes"});
            }
          } else {
            console.log('article insert err ', err);
            res.send({status: "fail", data: err});
          }
        });
      }
    });
  });
  /**
   * @swagger
   *  /articles/unhelpful/{user}/{article}:
   *    post:
   *      tags:
   *      - article
   *      description: 특정글의 helpful 정보를 수정함.
   *      parameters:
   *      - name: user
   *        in: path
   *        type: integer
   *        description: 추천한 유저의 id값 전달
   *      - name: article
   *        in: path
   *        type: integer
   *        description: 추천 받을 글의 id값 전달
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.post('/articles/unhelpful/:user/:article', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = " select count(*) checking, good from vote where article = ? and user = ? ";
        var params = [req.params.article,req.params.user];
        connection.query(sql, params,function(err, rows, fields) {
          if (!err) {
            if(rows[0].checking == 0){
              sql = " insert into vote(article, user, good) values(?,?,-1) ";
              connection.query(sql, params,function(err, rows, fields) {
                if(!err){
                  res.send({status: "success"});
                }else{
                  res.send({status: "fail", data: err});
                }
              });

            }else if(good == 1){
              sql = " update vote set good = -1 where article = ? and user = ? ";
              connection.query(sql, params,function(err, rows, fields) {
                if(!err) res.send({status: "success"});
                else res.send({status: "fail", data: err});
              });
            }else{
              res.send({status: "fail", data: "alredy votes"});
            }
          } else {
            console.log('article insert err ', err);
            res.send({status: "fail", data: err});
          }
        });
      }
    });
  });
  /**
   * @swagger
   *  /articles/views/{user}/{article}:
   *    post:
   *      tags:
   *      - article
   *      description: 특정글의 조회 정보를 수정함.
   *      parameters:
   *      - name: user
   *        in: path
   *        type: integer
   *        description: 조회 유저의 id값 전달
   *      - name: article
   *        in: path
   *        type: integer
   *        description: 조회 받을 글의 id값 전달
   *      - name: user_token
   *        in: header
   *        type: string
   *        description: 사용자의 token 값을 전달.
   *      responses:
   *        200:
   */
  app.post('/articles/views/:user/:article', function(req, res) {
    jwt.verify(req.headers.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = " select count(*) checking from view where article = ? and user = ? ";
        var params = [req.params.article,req.params.user];
        connection.query(sql, params,function(err, rows, fields) {
          if (!err) {
            if(rows[0].checking == 0){
              sql = " insert into view(article, user) values(?,?) ";
              connection.query(sql, params,function(err, rows, fields) {
                if(!err){
                  res.send({status: "success"});
                }else{
                  res.send({status: "fail", data: err});
                }
              });

            }else{
              res.send({status: "fail", data: "alredy views"});
            }
          } else {
            console.log('article insert err ', err);
            res.send({status: "fail", data: err});
          }
        });
      }
    });
  });

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
        connection.query(sql, params,function(err, rows, fields) {
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
