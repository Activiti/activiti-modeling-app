require('@alfresco/adf-cli/tooling').dotenvConfig({ path: process.env.ENV_FILE });

const APP_CONFIG_BPM_HOST = process.env.APP_CONFIG_BPM_HOST;

module.exports = {
    "/modeling-service": {
        "target": APP_CONFIG_BPM_HOST,
        "secure": false,
        "changeOrigin": true,
        "pathRewrite": {
            "^/modeling-service/modeling-service": ""
        },
        'logLevel': 'debug'
    },
    "/dmn-service": {
        "target": APP_CONFIG_BPM_HOST,
        "secure": false,
        "changeOrigin": true,
        "pathRewrite": {
            "^/dmn-service/dmn-service": ""
        },
        'logLevel': 'debug'
    },
    "/alfresco": {
        "target": APP_CONFIG_BPM_HOST,
        "secure": false,
        "pathRewrite": {
            "^/alfresco/alfresco": ""
        },
        "changeOrigin": true,
        'logLevel': 'debug'
    },
    "/script-service": {
        "target": APP_CONFIG_BPM_HOST,
        "secure": false,
        "changeOrigin": true,
        "pathRewrite": {
            "^/script-service/script-service": ""
        },
        'logLevel': 'debug'
    },
    "/identity-adapter-service": {
        "target": APP_CONFIG_BPM_HOST,
        "secure": false,
        "changeOrigin": true,
        "pathRewrite": {
            "^/identity-adapter-service/identity-adapter-service": ""
        },
        'logLevel': 'debug'
    }
};
