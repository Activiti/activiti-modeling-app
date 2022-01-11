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

import { GenericDownloadModelCommand } from './download-model.command';
import { Action, Store } from '@ngrx/store';
import { ContentType } from '../../api-implementations/acm-api/content-types';
import { ModelContentSerializer } from '../../api-implementations/acm-api/model-content-serializer';
import { PROCESS } from '../../api/types';

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

class TestDownloadAction {
    type: 'download';
    constructor() {}
}
class SpecificDownloadModelCommand extends GenericDownloadModelCommand {
    constructor(store: Store<any>, translationService: any) {
        super(store, { deserialize: JSON.parse } as unknown as ModelContentSerializer, translationService);
    }

    protected ValidateAction = TestValidateAction;
    protected DownloadAction = TestDownloadAction;
}

describe('GenericDownloadModelCommand', () => {

    const translationServiceMock = { instant: jest.fn().mockReturnValue('test-title-translated') };

    it('should trigger the proper action on store when executed', () => {
        const mockStore = { dispatch: jest.fn() } as unknown as Store;
        const command = new SpecificDownloadModelCommand(mockStore, translationServiceMock);
        const modelId = 'test-id';
        const modelContent = JSON.stringify({ foo: 'bar' });
        const modelMetadata = { bar: 'baz' };

        command.execute(PROCESS, ContentType.Process, modelId, modelContent, modelMetadata);

        const dispatchedAction = new TestValidateAction({
            title: 'test-title-translated',
            modelId: modelId,
            modelContent: JSON.parse(modelContent),
            modelMetadata,
            action: new TestDownloadAction()
        });
        expect(translationServiceMock.instant).toHaveBeenCalled();
        expect(mockStore.dispatch).toHaveBeenCalledWith(dispatchedAction);
    });
});
