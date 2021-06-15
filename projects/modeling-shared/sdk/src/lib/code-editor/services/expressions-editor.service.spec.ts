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

import { expectedPrimitiveTypes } from '../mocks/primitive-types.mock';
import { ExpressionsEditorService } from './expressions-editor.service';
import { ModelingTypesService } from './modeling-types.service';

describe('ExpressionsEditorService', () => {

    const modelingTypesService = {
        getType: jest.fn().mockImplementation((typeName: string) => expectedPrimitiveTypes[typeName])
    } as unknown as ModelingTypesService;

    const codeLine = 'beginning of the line ${folderVar[0].content.uri && folderVar.toString().split(",", 2)[myInteger].substring(0, 5).toUpperCase()} end of the line';

    const modelMock: monaco.editor.ITextModel = {
        getValueInRange: jest.fn().mockImplementation((range: monaco.IRange) => codeLine.substr(range.startColumn, range.endColumn - range.startColumn))
    } as unknown as monaco.editor.ITextModel;

    const position: monaco.Position = {
        lineNumber: 0,
        column: 48
    } as monaco.Position;

    const parameters = [
        {
            id: 'folder-node-id',
            name: 'folderVar',
            type: 'folder'
        },
        {
            id: 'an-integer-var',
            name: 'myInteger',
            type: 'integer'
        }
    ];

    const mockRange = {
        startLineNumber: 1,
        endLineNumber: 1,
        startColumn: 1,
        endColumn: 6
    };

    describe('static methods', () => {
        it('should get type name of the active cursor typing', () => {
            let testingPosition = { ...position, column: 39 } as monaco.Position;
            let typeName = ExpressionsEditorService.getTypeName(modelMock, testingPosition, parameters, modelingTypesService);

            expect(typeName).toEqual('content');

            testingPosition = { ...position, column: 47 } as monaco.Position;
            typeName = ExpressionsEditorService.getTypeName(modelMock, testingPosition, parameters, modelingTypesService);

            expect(typeName).toEqual('content-metadata');

            testingPosition = { ...position, column: 64 } as monaco.Position;
            typeName = ExpressionsEditorService.getTypeName(modelMock, testingPosition, parameters, modelingTypesService);

            expect(typeName).toEqual('folder');

            testingPosition = { ...position, column: 75 } as monaco.Position;
            typeName = ExpressionsEditorService.getTypeName(modelMock, testingPosition, parameters, modelingTypesService);

            expect(typeName).toEqual('string');

            testingPosition = { ...position, column: 100 } as monaco.Position;
            typeName = ExpressionsEditorService.getTypeName(modelMock, testingPosition, parameters, modelingTypesService);

            expect(typeName).toEqual('string');

            testingPosition = { ...position, column: 117 } as monaco.Position;
            typeName = ExpressionsEditorService.getTypeName(modelMock, testingPosition, parameters, modelingTypesService);

            expect(typeName).toEqual('string');
        });

        it('should get current signature method of the active cursor typing', () => {
            let testingPosition = { ...position, column: 82 } as monaco.Position;
            let activeParameterIndex = ExpressionsEditorService.getActiveParameter(modelMock, testingPosition);

            expect(activeParameterIndex).toEqual(0);

            testingPosition = { ...position, column: 83 } as monaco.Position;
            activeParameterIndex = ExpressionsEditorService.getActiveParameter(modelMock, testingPosition);

            expect(activeParameterIndex).toEqual(1);
        });

        it('should get the hover card for a method', () => {
            const mockCard = {
                range: mockRange,
                contents: [
                    { value: '*equals*' },
                    { value: 'Indicates whether some other object is "equal to" this one.' },
                    { value: 'type: boolean' }
                ]
            };

            const hoverCard = ExpressionsEditorService.getHoverCard('array', 'equals', mockRange, 'type', modelingTypesService);

            expect(hoverCard).toEqual(mockCard);
        });

        it('should get the hover card for a property', () => {
            const mockCard = {
                range: mockRange,
                contents: [
                    { value: '*length*' },
                    { value: 'Return the number of elements in the array' },
                    { value: 'type: integer' }
                ]
            };

            const hoverCard = ExpressionsEditorService.getHoverCard('array', 'length', mockRange, 'type', modelingTypesService);

            expect(hoverCard).toEqual(mockCard);
        });

        it('should return no hover card if the word is neither a method nor a property, or if no type is present', () => {
            let hoverCard = ExpressionsEditorService.getHoverCard('array', 'unknown', mockRange, 'type', modelingTypesService);

            expect(hoverCard).not.toBeDefined();

            hoverCard = ExpressionsEditorService.getHoverCard(null, 'length', mockRange, 'type', modelingTypesService);

            expect(hoverCard).not.toBeDefined();
        });
    });
});
