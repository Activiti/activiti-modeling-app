require('dotenv').config({ path: process.env.ENV_FILE });

const APP_CONFIG_BPM_HOST = process.env.APP_CONFIG_BPM_HOST;
const EXAMPLE_PROJECTS_HOST = process.env.EXAMPLE_PROJECTS_HOST;

module.exports = {
    "/modeling-service": {
        "target": APP_CONFIG_BPM_HOST,
        "secure": false,
        "changeOrigin": true,
        "pathRewrite": {
            "^/modeling-service/modeling-service": ""
        },
        "logLevel": "silent"
    },
    "/dmn-service": {
        "target": APP_CONFIG_BPM_HOST,
        "secure": false,
        "changeOrigin": true,
        "pathRewrite": {
            "^/dmn-service/dmn-service": ""
        },
        "logLevel": "silent"
    },
    "/alfresco": {
        "target": APP_CONFIG_BPM_HOST,
        "secure": false,
        "pathRewrite": {
            "^/alfresco/alfresco": ""
        },
        "changeOrigin": true
    },
    "/script-service": {
        "target": APP_CONFIG_BPM_HOST,
        "secure": false,
        "changeOrigin": true,
        "pathRewrite": {
            "^/script-service/script-service": ""
        },
        "logLevel": "silent"
    },
    "/example-projects-service": {
        "target": EXAMPLE_PROJECTS_HOST,
        "secure": false,
        "changeOrigin": true,
        "pathRewrite": {
            "^/example-projects-service/example-projects-service": ""
        },
        "logLevel": "silent"
    }
};
