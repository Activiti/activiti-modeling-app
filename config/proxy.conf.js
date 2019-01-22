require('dotenv').config();

const API_HOST = process.env.API_HOST;
const SERVICE_PREFIX = process.env.SERVICE_PREFIX;
const REALM = process.env.REALM;

module.exports = {
    "/api": {
      "target": API_HOST,
      "secure": false,
      "changeOrigin": true,
      "pathRewrite": {
        "^/api": "/" + SERVICE_PREFIX
      },
      "logLevel": "debug"
    },
    "/auth": {
        "target": API_HOST,
        "secure": false,
        "changeOrigin": true,
        "pathRewrite": {
            "^/auth": "/auth/realms/" + REALM
        },
        "logLevel": "debug"
    }
};
