const cpx = require('cpx');

//Workaround for https://github.com/angular/angular-cli/issues/8783
//we copy before the files in dist-dev-temp in the demo shell and after we let the angular cli watch over them..double wathh necessary for dev mode

const libDir = '../alfresco-ng2-components/lib';

cpx.watch(libDir + '/core/prebuilt-themes/**/*.*', './dist-dev-temp/assets/prebuilt-themes');
cpx.watch(libDir + '/core/i18n/**/*.*', './dist-dev-temp/assets/adf-core/i18n');
cpx.watch(libDir + '/core/assets/**/*.*', './dist-dev-temp/assets/');
