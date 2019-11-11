const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

const dirs = [
    'moddle',
    'moddle-xml',
    'bpmn-moddle',
    'bpmn-js',
    'diagram-js',
    'dmn-moddle',
    'dmn-js-shared',
    'dmn-js-drd',
    'dmn-js-decision-table',
    'table-js',
    'dmn-js-literal-expression'
];

function copyFolderSync(from, to) {
    if (fs.existsSync(to)) {
        rimraf.sync(to);
    }

    fs.mkdirSync(to);
    fs.readdirSync(from).forEach(element => {
        if (fs.lstatSync(path.join(from, element)).isFile()) {
            fs.copyFileSync(path.join(from, element), path.join(to, element));
        } else {
            copyFolderSync(path.join(from, element), path.join(to, element));
        }
    });
}

// Jest doesn't want to behave with the transformIgnorePatterns, that is why this hack
function transformFiles(workPath) {
    const files = fs.readdirSync(workPath);
    for (let file of files) {
        const filePath = path.join(workPath, file);

        if (file === 'test' || file === 'assets' || file === 'dist') {
            continue;
        }

        if (fs.lstatSync(filePath).isDirectory()) {
            transformFiles(filePath);
            continue;
        }
        if (path.extname(file) === '.js') {
            const content = fs.readFileSync(filePath, { encoding: 'utf-8' });
            const result = require('@babel/core').transform(content, {
                plugins: ['transform-es2015-modules-commonjs']
            });
            fs.writeFileSync(filePath, result.code, { encoding: 'utf-8' });
        }
    }
}

for (let dir of dirs) {
    const workPath = path.resolve(process.cwd(), 'node_modules', dir);
    if (fs.existsSync(workPath)) {
        console.log('Transforming: ' + workPath);
        copyFolderSync(workPath, workPath + '-transpiled');
        transformFiles(workPath + '-transpiled');
    } else {
        console.warn(`${workPath} does not exists.`);
    }
}
