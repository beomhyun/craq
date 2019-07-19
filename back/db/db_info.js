module.exports = (function () {
  return {
    local: { // localhost
      host: '192.168.31.58',
      post: 3306,
      user: 'root',
      password: 'root',
      database: 'webmobile'
    },
    real: { // real server db info
      host: '',
      port: '',
      user: '',
      password: '!',
      database: ''
    },
    dev: { // dev server db info
      host: '',
      port: '',
      user: '',
      password: '',
      database: ''
    }
  }
})();
