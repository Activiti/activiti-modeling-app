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

import { sanitizeString, createProcessName, formatUuid, MODELER_NAME_REGEX } from './create-entries-names';

describe('Create entries names', () => {
    it ('test sanitizeString function', () => {
        const text = 'abc!!!_@@-01023';
        expect(sanitizeString(text)).toEqual('abc-01023');
    });

    it('test createProcessName function', () => {
        const name = 'process.bpmn20.xml';
        expect(createProcessName(name)).toEqual('process');
    });

    it('test formatUid', () => {
        /* cspell: disable-next-line */
        expect(formatUuid('testType', '1234')).toEqual('testtype-1234');
    });

    it('MODELER_NAME_REGEX should not allow empty strings', () => {
        const testString = ' ';
        expect(MODELER_NAME_REGEX.test(testString)).toBe(false);
    });

    it('MODELER_NAME_REGEX should not allow special character besides _', () => {
        const testString = 'test%#$#text';
        expect(MODELER_NAME_REGEX.test(testString)).toBe(false);
    });

    it('MODELER_NAME_REGEX should not allow - at the end of the string', () => {
        const testString = 'test-';
        expect(MODELER_NAME_REGEX.test(testString)).toBe(false);
    });

    it('MODELER_NAME_REGEX should allow - inside the string', () => {
        const testString = 'test-123';
        expect(MODELER_NAME_REGEX.test(testString)).toBe(true);
    });

    it('MODELER_NAME_REGEX should not allow string starting with numeral', () => {
        const testString = '123-test';
        expect(MODELER_NAME_REGEX.test(testString)).toBe(false);
    });

});

