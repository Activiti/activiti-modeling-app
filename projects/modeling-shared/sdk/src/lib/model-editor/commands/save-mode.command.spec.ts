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
import { PROCESS } from '../../api/types';
import { GenericSaveModelCommand } from './save-model.command';

class TestValidateAction {
    type: 'validate';
    constructor(public payload: {
        title: string;
        modelId: string;
        modelContent: any;
        action: Action;
    }) {}
}

class TestUpdateAction {
    type: 'update';
    constructor(public payload: any) {}
}
class SpecificSaveModelCommand extends GenericSaveModelCommand {
    constructor(store: Store<any>, translationService: any) {
        super(store, translationService);
    }

    protected ValidateAction = TestValidateAction;
    protected UpdateAction = TestUpdateAction;
}

describe('GenericSaveModelCommand', () => {

    const translationServiceMock = { instant: jest.fn().mockReturnValue('test-title-translated') };

    it('should trigger the proper action on store when executed', () => {
        const mockStore = { dispatch: jest.fn() } as unknown as Store;
        const command = new SpecificSaveModelCommand(mockStore, translationServiceMock);
        const modelId = 'test-id';
        const modelContent = JSON.stringify({ foo: 'bar' });

        command.execute(PROCESS, modelId, modelContent);

        const dispatchedAction = new TestValidateAction({
            title: 'test-title-translated',
            modelId: modelId,
            modelContent: JSON.parse(modelContent),
            action: new TestUpdateAction(JSON.parse(modelContent))
        });
        expect(translationServiceMock.instant).toHaveBeenCalled();
        expect(mockStore.dispatch).toHaveBeenCalledWith(dispatchedAction);
    });
});
