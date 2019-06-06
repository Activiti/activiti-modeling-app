require('dotenv').config();

const API_HOST = process.env.API_HOST;
const OAUTH_HOST = process.env.OAUTH_HOST;

module.exports = {
    "/api": {
      "target": API_HOST,
      "secure": false,
      "changeOrigin": true,
      "pathRewrite": {
        "^/api": ""
      },
      "logLevel": "debug"
    },
    "/auth": {
        "target": OAUTH_HOST,
        "secure": false,
        "changeOrigin": true,
        "pathRewrite": {
            "^/auth": ""
        },
        "logLevel": "debug"
    }
};
