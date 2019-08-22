module.exports = (function () {
  return {
    local: { // localhost
      host: 'localhost',
      post: 9000,
      user: 'root',
      password: 'root',
      database: 'craq'
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
