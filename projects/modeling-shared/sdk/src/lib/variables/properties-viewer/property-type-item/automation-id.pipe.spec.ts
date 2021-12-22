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

import { AutomationIdPipe } from './automation-id.pipe';

describe('AutomationIdPipe', () => {

    let pipe: AutomationIdPipe;

    beforeEach(() => {
        pipe = new AutomationIdPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should get data automation id when no prefix is provided', () => {
        expect(pipe.transform('this-is-a-test', 'automation')).toEqual('automation-this-is-a-test');
    });

    it('should get data automation id when prefix is provided', () => {
        expect(pipe.transform('this is A Test', 'automation', 'prefix')).toEqual('prefix-automation-this-is-a-test');
    });
});
