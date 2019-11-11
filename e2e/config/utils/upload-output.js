const path = require('path');
const fs = require('fs');
const htmlReporter = require('protractor-html-reporter-2');
const AlfrescoApi = require('@alfresco/js-api');
const buildNumber = require('./build-number');
const config = require('../config');
const rimraf = require('rimraf');

uploadOutput = async function(FOLDER, retryCount = 1) {

    let filenameReport = `ProtractorTestReport-${FOLDER.replace('/', '')}-${retryCount}`;

    let output = '';
    let savePath = config.paths.junitReport;
    let temporaryHtmlPath = path.join(savePath, 'html/temporaryHtml');
    let lastFileName = '';

    let files = fs.readdirSync(savePath);

    if (files && files.length > 0) {
        for (const fileName of files) {
            testConfigReport = {
                reportTitle: 'Protractor Test Execution Report',
                outputPath: temporaryHtmlPath,
                outputFilename: Math.random().toString(36).substr(2, 5) + filenameReport,
            };

            let filePath = path.join(config.paths.junitReport, fileName);

            new htmlReporter().from(filePath, testConfigReport);
            lastFileName = testConfigReport.outputFilename;
        }
    }

    let lastHtmlFile = path.join(temporaryHtmlPath, lastFileName + '.html');

    if (!(fs.lstatSync(lastHtmlFile).isDirectory())) {
        output = output + fs.readFileSync(lastHtmlFile);
    }

    let fileName = path.join(savePath, 'html',  filenameReport + '.html');

    fs.writeFileSync(fileName, output, 'utf8');

    let alfrescoJsApi = new AlfrescoApi({ provider: 'ECM', hostEcm: config.ama.backendConfig.bpmHost });
    alfrescoJsApi.login(config.ama.user, config.ama.password);

    await saveScreenshots(alfrescoJsApi, retryCount);
    await saveReport(filenameReport, alfrescoJsApi);

    rimraf(config.paths.screenShots, function () {
        console.log('done delete screenshot');
    });
}

async function saveReport(filenameReport, alfrescoJsApi) {
    let pathFile = path.join(config.paths.junitReport, '/html', filenameReport + '.html');
    let reportFile = fs.createReadStream(pathFile);

    let reportFolder;

    try {
        reportFolder = await alfrescoJsApi.nodes.addNode('-my-', {
            'name': 'report',
            'relativePath': `Builds/AMA-${buildNumber()}`,
            'nodeType': 'cm:folder'
        }, {}, {
            'overwrite': true
        });
    } catch (error) {
        reportFolder = await alfrescoJsApi.nodes.getNode('-my-', {
            'relativePath': `Builds/AMA-${buildNumber()}/report`,
            'nodeType': 'cm:folder'
        }, {}, {
            'overwrite': true
        });

    }

    try {
        await
            alfrescoJsApi.upload.uploadFile(
                reportFile,
                '',
                reportFolder.entry.id,
                null,
                {
                    'name': reportFile.name,
                    'nodeType': 'cm:content',
                    'autoRename': true
                }
            );

    } catch (error) {
        console.log('error' + error);
    }
};

async function saveScreenshots(alfrescoJsApi, retryCount) {
    let files = fs.readdirSync(config.paths.screenShots);

    if (files && files.length > 0) {

        let folder;

        try {
            folder = await alfrescoJsApi.nodes.addNode('-my-', {
                'name': `retry-${retryCount}`,
                'relativePath': `Builds/AMA-${buildNumber()}/screenshot`,
                'nodeType': 'cm:folder'
            }, {}, {
                'overwrite': true
            });
        } catch (error) {
            folder = await alfrescoJsApi.nodes.getNode('-my-', {
                'relativePath': `Builds/AMA-${buildNumber()}/screenshot/retry-${retryCount}`,
                'nodeType': 'cm:folder'
            }, {}, {
                'overwrite': true
            });
        }

        for (const fileName of files) {
            let pathFile = path.join(config.paths.screenShots, fileName);
            let file = fs.createReadStream(pathFile);

            let safeFileName = fileName.replace(new RegExp('"', 'g'), '');

            try {
                await alfrescoJsApi.upload.uploadFile(
                    file,
                    '',
                    folder.entry.id,
                    null,
                    {
                        'name': safeFileName,
                        'nodeType': 'cm:content',
                        'autoRename': true
                    }
                );
            }catch(error){
                console.log(error);
            }
        }
    }
};

module.exports = uploadOutput;
