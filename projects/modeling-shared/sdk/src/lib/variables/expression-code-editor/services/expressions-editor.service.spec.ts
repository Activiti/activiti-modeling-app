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

import { TranslationMock } from '@alfresco/adf-core';
import { CodeEditorService } from '../../../code-editor/services/code-editor-service.service';
import { JSONSchemaToEntityPropertyService } from '../../../services/json-schema-to-entity-property.service';
import { ModelingJSONSchemaService } from '../../../services/modeling-json-schema.service';
import { primitiveTypesSchema } from './expression-language/primitive-types-schema';
import { ExpressionsEditorService } from './expressions-editor.service';
import { ModelingTypesService } from './modeling-types.service';

describe('ExpressionsEditorService', () => {
    const translateService = new TranslationMock();
    translateService.instant = (key: string | Array<string>) => key === 'SDK.VARIABLES_EDITOR.TABLE.COLUMN_TYPE' ? 'type' : key;

    const codeEditorService = new CodeEditorService();
    const modelingJSONSchemaService = new ModelingJSONSchemaService(codeEditorService, [], []);
    modelingJSONSchemaService.initializeProjectSchema('test');
    const jSONSchemaToEntityPropertyService = new JSONSchemaToEntityPropertyService(modelingJSONSchemaService);
    const modelingTypesService = new ModelingTypesService(modelingJSONSchemaService, jSONSchemaToEntityPropertyService);

    const codeLine = 'beginning of the line ${myFileVar[0].content.uri && myFileVar.toString().split(",", 2)[myInteger].substring(0, 5).toUpperCase()} end of the line';
    const modelMock: monaco.editor.ITextModel = {
        getValueInRange: jest.fn().mockImplementation((range: monaco.IRange) => codeLine.substr(range.startColumn, range.endColumn - range.startColumn))
    } as unknown as monaco.editor.ITextModel;

    const position: monaco.Position = {
        lineNumber: 0,
        column: 48
    } as monaco.Position;

    const parameters = [
        {
            id: 'file-node-id',
            name: 'myFileVar',
            type: 'file'
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

        it('should get model schema of the active cursor typing', () => {
            let testingPosition = { ...position, column: 39 } as monaco.Position;
            let modelSchema = ExpressionsEditorService.getModelSchema(modelMock, testingPosition, parameters, modelingTypesService);

            const expectedContent: any = { ...primitiveTypesSchema.$defs.primitive['content'], properties: { content: {} } };
            expectedContent.properties = { ...primitiveTypesSchema.$defs.primitive['content'].properties };
            expectedContent.properties.content = { ...primitiveTypesSchema.$defs.primitive['content-info'] };
            expect(modelSchema).toEqual(expectedContent);

            testingPosition = { ...position, column: 47 } as monaco.Position;
            modelSchema = ExpressionsEditorService.getModelSchema(modelMock, testingPosition, parameters, modelingTypesService);

            expect(modelSchema).toEqual(primitiveTypesSchema.$defs.primitive['content-info']);

            testingPosition = { ...position, column: 64 } as monaco.Position;
            modelSchema = ExpressionsEditorService.getModelSchema(modelMock, testingPosition, parameters, modelingTypesService);

            const expectedFile = { ...primitiveTypesSchema.$defs.primitive['file'], type: [] };
            expectedFile.type.push(expectedContent);
            expectedFile.type.push({
                type: 'array',
                items: expectedContent
            });
            expect(modelSchema).toEqual(expectedFile);

            testingPosition = { ...position, column: 75 } as monaco.Position;
            modelSchema = ExpressionsEditorService.getModelSchema(modelMock, testingPosition, parameters, modelingTypesService);

            expect(modelSchema).toEqual(primitiveTypesSchema.$defs.primitive['string']);

            testingPosition = { ...position, column: 100 } as monaco.Position;
            modelSchema = ExpressionsEditorService.getModelSchema(modelMock, testingPosition, parameters, modelingTypesService);

            expect(modelSchema).toEqual(primitiveTypesSchema.$defs.primitive['string']);

            testingPosition = { ...position, column: 117 } as monaco.Position;
            modelSchema = ExpressionsEditorService.getModelSchema(modelMock, testingPosition, parameters, modelingTypesService);

            expect(modelSchema).toEqual(primitiveTypesSchema.$defs.primitive['string']);
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

            const hoverCard = ExpressionsEditorService.getHoverCard(primitiveTypesSchema.$defs.primitive['array'], 'equals', mockRange, modelingTypesService, translateService);

            expect(hoverCard).toEqual(mockCard);
        });

        it('should get the hover card for a property', () => {
            const mockCard = {
                range: mockRange,
                contents: [
                    { value: '*size*' },
                    { value: 'Returns the number of elements in this list.' },
                    { value: 'type: integer' }
                ]
            };

            const hoverCard = ExpressionsEditorService.getHoverCard(primitiveTypesSchema.$defs.primitive['array'], 'size', mockRange, modelingTypesService, translateService);

            expect(hoverCard).toEqual(mockCard);
        });

        it('should return no hover card if the word is neither a method nor a property, or if no type is present', () => {
            let hoverCard = ExpressionsEditorService.getHoverCard(primitiveTypesSchema.$defs.primitive['array'], 'unknown', mockRange, modelingTypesService, translateService);

            expect(hoverCard).not.toBeDefined();

            hoverCard = ExpressionsEditorService.getHoverCard(null, 'length', mockRange, modelingTypesService, translateService);

            expect(hoverCard).not.toBeDefined();
        });

        it('should return the return type of language registered functions', () => {
            let modelSchema = ExpressionsEditorService.getModelSchemaFromLanguageFunctions('now()', modelingTypesService);

            expect(modelSchema).toEqual(primitiveTypesSchema.$defs.primitive['date']);

            modelSchema = ExpressionsEditorService.getModelSchemaFromLanguageFunctions('now', modelingTypesService);

            expect(modelSchema).toEqual(primitiveTypesSchema.$defs.primitive['date']);
        });
    });
});
