const path = require('path');
const outputDir = path.join(__dirname, '/../../e2e-output');

module.exports = {
    browserWidth: 1920,
    browserHeight: 1080,

    paths: {
        tmp: path.join(outputDir, '/tmp'),
        screenShots: path.join(outputDir, '/screenshots'),
        junitReport: path.join(outputDir, '/junit-report'),
        reports: path.join(outputDir, '/reports/'),
        download: path.join(outputDir, '/downloads')
    },
    ama: {
        backendConfig: {
            bpmHost: process.env.API_HOST
        },
        user: process.env.E2E_USERNAME,
        password: process.env.E2E_PASSWORD
    }
}

