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
import { GenericSaveModelCommand } from './save-model.command';

class TestValidateAction implements Action {
    type: 'validate';

    constructor(public payload: {
        title: string;
        triggerId: string;
        triggerContent: any;
        action: Action;
        errorAction?: Action;
        projectId?: string;
    }) {}
}

class TestUpdateAction implements Action {
    type: 'update';

    constructor(public payload: {
        id: string;
        name: string;
        description?: string;
    }) {}
}
class SpecificSaveModelCommand extends GenericSaveModelCommand {
    constructor(store: Store<any>) {
        super(store);
    }

    protected title = 'test-title';
    protected ValidateAction = TestValidateAction;
    protected UpdateAction = TestUpdateAction;
}

describe('GenericSaveModelCommand', () => {

    it('should trigger the proper action on store when executed', () => {
        const mockStore = { dispatch: jest.fn() } as unknown as Store;
        const command = new SpecificSaveModelCommand(mockStore);
        const modelId = 'test-id';
        const modelContent = JSON.stringify({ foo: 'bar' });

        command.execute(modelId, modelContent);

        const dispatchedAction = new TestValidateAction({
            title: 'test-title',
            triggerId: modelId,
            triggerContent: JSON.parse(modelContent),
            action: new TestUpdateAction(JSON.parse(modelContent))
        });
        expect(mockStore.dispatch).toHaveBeenCalledWith(dispatchedAction);
    });
});
