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

import { Action, Store } from '@ngrx/store';
import { ContentType } from '../../api-implementations/acm-api/content-types';
import { ModelContentSerializer } from '../../api-implementations/acm-api/model-content-serializer';
import { PROCESS } from '../../api/types';
import { GenericSaveAsModelCommand } from './save-as-model.command';
import { SaveAsDialogPayload } from '../../components/save-as-dialog/save-as-dialog.component';
import { ModelDataExtractor } from '../../api-implementations/acm-api/model-data-extractor';

class TestValidateAction {
    type: 'validate';
    constructor(public payload: {
        title: string;
        modelId: string;
        modelContent: any;
        modelMetadata: any;
        action: Action;
    }) {}
}

class OpenSaveAsAction {
    type: 'dialog';
    constructor(public payload: SaveAsDialogPayload ) {}
}

class SaveAsModelAction {
    type: 'save';
    constructor(public payload: SaveAsDialogPayload) {}
}

class SpecificSaveAsModelCommand extends GenericSaveAsModelCommand {
    constructor(store: Store<any>, translationService: any) {
        super(
            store,
            { deserialize: JSON.parse } as unknown as ModelContentSerializer,
            { get: () => 'bar'  } as unknown as ModelDataExtractor,
            translationService);
    }

    protected ValidateAction = TestValidateAction;
    protected SaveAsModelAction = SaveAsModelAction;
    protected OpenSaveAsAction = OpenSaveAsAction;

}

describe('GenericSaveAsModelCommand', () => {

    const translationServiceMock = { instant: jest.fn().mockReturnValue('test-title-translated') };

    it('should trigger the proper action on store when executed', () => {
        const mockStore = { dispatch: jest.fn() } as unknown as Store;
        const command = new SpecificSaveAsModelCommand(mockStore, translationServiceMock);
        const modelId = 'test-id';
        const modelContent = { name: 'bar', description: 'ban bar', sourceModelMetadata: null };
        const modelContentString = JSON.stringify(modelContent);
        const modelMetadata = { bar: 'baz' };

        command.execute(PROCESS, ContentType.Process, modelId, modelContentString, modelMetadata);

        const saveAsDialogPayload: SaveAsDialogPayload = {
            sourceModelContent: modelContent,
            name: 'bar',
            description: 'bar',
            sourceModelMetadata: modelMetadata,
            action: SaveAsModelAction
        };

        const dispatchedAction = new TestValidateAction({
            title: 'test-title-translated',
            modelId: modelId,
            modelContent: modelContent,
            modelMetadata,
            action: new OpenSaveAsAction(saveAsDialogPayload)
        });

        expect(translationServiceMock.instant).toHaveBeenCalled();
        expect(mockStore.dispatch).toHaveBeenCalledWith(dispatchedAction);
    });
});
