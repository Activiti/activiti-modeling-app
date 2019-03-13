const DisplayProcessor = require ('jasmine-spec-reporter').DisplayProcessor;
const moment = require('moment');

function TimeProcessor(configuration) {}

TimeProcessor.prototype = new DisplayProcessor();
const getDate = () => {
    return '[' + moment().format("HH:mm:ss") + ']';
};

TimeProcessor.prototype.displayJasmineStarted = (runner, log) => {
    return getDate() + ' - ' + log;
};

TimeProcessor.prototype.displaySuite = (suite, log) => {
    return getDate() + ' Suite Started - ' + log;
};

TimeProcessor.prototype.displaySpecStarted = (spec, log) => {
    return getDate() + ' Spec Started';
};

TimeProcessor.prototype.displaySuccessfulSpec = (spec, log) => {
    return getDate() + ' ' + log + ' - Spec Ended';
};

TimeProcessor.prototype.displayFailedSpec = (spec, log) => {
    return  getDate() + ' Suite Failed - ' + log;
};

module.exports = TimeProcessor;
