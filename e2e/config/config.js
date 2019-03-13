const path = require('path');
const outputDir = path.join(__dirname, '/../../e2e-output');

module.exports = {
    browserWidth: 1600,
    browserHeight: 1000,

    paths: {
        tmp: path.join(outputDir, '/tmp'),
        screenShots: path.join(outputDir, '/screenshots'),
        junitReport: path.join(outputDir, '/junit-report'),
        reports: path.join(outputDir, '/reports/'),
        download: path.join(outputDir, '/downloads')
    },

    screenshots: {
        url: process.env.SCREENSHOT_URL,
        user: process.env.SCREENSHOT_USERNAME,
        password: process.env.SCREENSHOT_PASSWORD,
    }
}

