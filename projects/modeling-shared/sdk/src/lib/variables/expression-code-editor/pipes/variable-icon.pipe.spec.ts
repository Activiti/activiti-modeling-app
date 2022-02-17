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

import { EntityProperty } from '../../../api/types';
import { VariableIconPipe } from './variable-icon.pipe';

describe('VariableIconPipe', () => {

    let pipe: VariableIconPipe;

    beforeAll(() => {
        pipe = new VariableIconPipe();
    });

    it('should get proper icon', () => {
        const variable: EntityProperty = {
            id: 'variable',
            name: 'variable',
            type: 'string'
        };

        expect(pipe.transform(variable)).toEqual('s');

        variable.type = 'array';
        expect(pipe.transform(variable)).toEqual('a');

        variable.type = 'boolean';
        expect(pipe.transform(variable)).toEqual('b');

        variable.type = 'date';
        expect(pipe.transform(variable)).toEqual('d');

        variable.type = 'datetime';
        expect(pipe.transform(variable)).toEqual('dt');

        variable.type = 'file';
        expect(pipe.transform(variable)).toEqual('f');

        variable.type = 'folder';
        expect(pipe.transform(variable)).toEqual('fo');

        variable.type = 'json';
        expect(pipe.transform(variable)).toEqual('j');

        variable.type = 'string';
        variable.aggregatedTypes = ['string'];
        expect(pipe.transform(variable)).toEqual('s');

        variable.type = 'json';
        variable.aggregatedTypes = ['string', 'boolean'];
        expect(pipe.transform(variable)).toEqual('m');
    });
});
