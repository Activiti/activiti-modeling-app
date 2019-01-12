/** Source: https://www.xfive.co/blog/testing-angular-faster-jest/  */
import 'hammerjs/hammer';
import './jest-global-mocks';
import 'jest-preset-angular';

/** Zone shorter output and more meaningful error stack traces */
Error.stackTraceLimit = 2;

/** ISSUE: https://github.com/kirjs/react-highcharts/issues/296 */
const createElementNsOrig = document.createElementNS;
document.createElementNS = function(namespaceUri: string, qualifiedName: string) {
  if (namespaceUri === 'http://www.w3.org/2000/svg') {
    if (qualifiedName === 'svg') {
      const element = createElementNsOrig.apply(this, arguments);
      element.createSVGRect = function() {}; // highcharts test this property and fallback to VML with unexpected results
      return element;
    }
    if (qualifiedName === 'text') {
        return document.createElement('text');
    }
  }

  return createElementNsOrig.apply(this, arguments);
};
