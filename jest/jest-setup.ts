/*!
 * @license
 * Copyright 2019 Alfresco, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** Source: https://www.xfive.co/blog/testing-angular-faster-jest/  */
import './jest-global-mocks';
import 'jest-preset-angular/setup-jest';

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
