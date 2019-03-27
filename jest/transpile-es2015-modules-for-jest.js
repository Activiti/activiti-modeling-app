const fs = require('fs');
const path = require('path');

function copyFolderSync(from, to) {
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

// below list all packages that give you headaches, these are mine
const dirs = [
  'moddle',
  'moddle-xml',
  'bpmn-moddle',
  'bpmn-js',
  'diagram-js'
];

for (let dir of dirs) {
  const workPath = __dirname + '/../node_modules/' + dir;
  if (fs.existsSync(workPath)) {
    console.log('Transforming: ' + workPath);
    copyFolderSync(workPath, workPath + '-transpiled');
    transformFiles(workPath + '-transpiled');
  } else {
      console.log(`${workPath} does not exists.`);
  }
}
