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

import { ExpressionSyntax } from '../../api/types';
import { MappingDialogSelectedTabPipe } from './mapping-dialog-selected-tab.pipe';

describe('MappingDialogSelectedTabPipe', () => {

    const pipe = new MappingDialogSelectedTabPipe();

    it('should return false when tab check is different from selected tab', () => {
        expect(pipe.transform(0, 'variable', 1, false, false, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(1, 'variable', 0, false, false, ExpressionSyntax.JUEL)).toBeFalsy();
    });

    it('should return the proper value for the expression editor tab', () => {
        expect(pipe.transform(2, 'expression', 2, false, false, ExpressionSyntax.NONE)).toBeFalsy();

        expect(pipe.transform(0, 'expression', 0, false, false, ExpressionSyntax.JUEL)).toBeTruthy();
        expect(pipe.transform(0, 'expression', 0, true, false, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(0, 'expression', 0, false, true, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(0, 'expression', 0, true, true, ExpressionSyntax.JUEL)).toBeFalsy();

        expect(pipe.transform(1, 'expression', 1, false, false, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(1, 'expression', 1, true, false, ExpressionSyntax.JUEL)).toBeTruthy();
        expect(pipe.transform(1, 'expression', 1, false, true, ExpressionSyntax.JUEL)).toBeTruthy();
        expect(pipe.transform(1, 'expression', 1, true, true, ExpressionSyntax.JUEL)).toBeFalsy();

        expect(pipe.transform(2, 'expression', 2, false, false, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(2, 'expression', 2, true, false, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(2, 'expression', 2, false, true, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(2, 'expression', 2, true, true, ExpressionSyntax.JUEL)).toBeTruthy();

        expect(pipe.transform(3, 'expression', 3, false, false, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(3, 'expression', 3, true, false, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(3, 'expression', 3, false, true, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(3, 'expression', 3, true, true, ExpressionSyntax.JUEL)).toBeFalsy();
    });

    it('should return the proper value for the value tab', () => {
        expect(pipe.transform(0, 'value', 0, false, false, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(0, 'value', 0, true, false, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(0, 'value', 0, false, true, ExpressionSyntax.JUEL)).toBeTruthy();
        expect(pipe.transform(0, 'value', 0, true, true, ExpressionSyntax.JUEL)).toBeFalsy();

        expect(pipe.transform(1, 'value', 1, false, false, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(1, 'value', 1, true, false, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(1, 'value', 1, false, true, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(1, 'value', 1, true, true, ExpressionSyntax.JUEL)).toBeTruthy();

        expect(pipe.transform(2, 'value', 2, false, false, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(2, 'value', 2, true, false, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(2, 'value', 2, false, true, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(2, 'value', 2, true, true, ExpressionSyntax.JUEL)).toBeFalsy();

        expect(pipe.transform(3, 'value', 3, false, false, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(3, 'value', 3, true, false, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(3, 'value', 3, false, true, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(3, 'value', 3, true, true, ExpressionSyntax.JUEL)).toBeFalsy();
    });

    it('should return the proper value for the variable tab', () => {
        expect(pipe.transform(0, 'variable', 0, false, false, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(0, 'variable', 0, true, false, ExpressionSyntax.JUEL)).toBeTruthy();
        expect(pipe.transform(0, 'variable', 0, false, true, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(0, 'variable', 0, true, true, ExpressionSyntax.JUEL)).toBeTruthy();

        expect(pipe.transform(1, 'variable', 1, false, false, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(1, 'variable', 1, true, false, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(1, 'variable', 1, false, true, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(1, 'variable', 1, true, true, ExpressionSyntax.JUEL)).toBeFalsy();

        expect(pipe.transform(2, 'variable', 2, false, false, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(2, 'variable', 2, true, false, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(2, 'variable', 2, false, true, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(2, 'variable', 2, true, true, ExpressionSyntax.JUEL)).toBeFalsy();

        expect(pipe.transform(3, 'variable', 3, false, false, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(3, 'variable', 3, true, false, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(3, 'variable', 3, false, true, ExpressionSyntax.JUEL)).toBeFalsy();
        expect(pipe.transform(3, 'variable', 3, true, true, ExpressionSyntax.JUEL)).toBeFalsy();
    });
});
