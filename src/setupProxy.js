const proxy = require("http-proxy-middleware");
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = app => {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:4000",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/api/v1"
      }
    })
  );

  app.use(morgan('combined'));
};