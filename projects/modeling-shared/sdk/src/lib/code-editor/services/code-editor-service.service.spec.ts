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

import { TestBed } from '@angular/core/testing';
import { CodeEditorService } from './code-editor-service.service';

describe('CodeEditorService', () => {
    let service: CodeEditorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CodeEditorService]
        });
        service = TestBed.inject(CodeEditorService);
    });

    it('should add new schema on replaceSchema when it does not exist previously', () => {
        const addSchemaSpy = spyOn(service, 'addSchema');
        service.replaceSchema('test', 'test', 'test');
        expect(addSchemaSpy).toHaveBeenCalled();
    });

    it('should not add new schema on replaceSchema when it exist previously', () => {
        service.addSchema('test', 'test-add', 'test-add');
        const addSchemaSpy = spyOn(service, 'addSchema');
        service.replaceSchema('test', 'test-replace', 'test-replace');
        expect(addSchemaSpy).not.toHaveBeenCalled();
    });

    it('should call deleteSchema on deleteSchemaByUri when uri is present', () => {
        service.addSchema('test', 'test-add', 'test-add');
        const deleteSchemaSpy = spyOn<any>(service, 'deleteSchema');
        service.deleteSchemaByUri('test');
        expect(deleteSchemaSpy).toHaveBeenCalled();
    });

    it('should not call deleteSchema on deleteSchemaByUri when uri is not present', () => {
        const deleteSchemaSpy = spyOn<any>(service, 'deleteSchema');
        service.deleteSchemaByUri('notPresent');
        expect(deleteSchemaSpy).not.toHaveBeenCalled();
    });
});
