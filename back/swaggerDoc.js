const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    info: {
      title: 'Test API',
      version: '1.0.0',
      description: 'Test Express API with autogenerated swagger doc',
    },
    basePath: '/',
  },
  apis: ['./model/user.js','./model/topic.js','./model/notice.js','./model/subscribe.js','./model/article.js','./model/comment.js','./model/content.js','./model/hashtag.js','./model/tag.js','./model/vote.js','./model/ward.js','./model/manager.js'],
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(specs));
}
