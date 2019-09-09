require('dotenv').config({ path: process.env.ENV_FILE });

const API_HOST = process.env.API_HOST;
const OAUTH_HOST = process.env.OAUTH_HOST;

module.exports = {
    "/modeling-service": {
        "target": API_HOST,
        "secure": false,
        "changeOrigin": true,
        "pathRewrite": {
            "^/modeling-service/modeling-service": ""
        },
        "logLevel": "silent"
    },
    "/dmn-service": {
        "target": API_HOST,
        "secure": false,
        "changeOrigin": true,
        "pathRewrite": {
            "^/dmn-service/dmn-service": ""
        },
        "logLevel": "silent"
    },
    "/auth": {
        "target": OAUTH_HOST,
        "secure": false,
        "changeOrigin": true,
        "pathRewrite": {
            "^/auth": ""
        },
        "logLevel": "silent"
    }
};
