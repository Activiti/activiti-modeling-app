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

import { GenericDeleteModelCommand } from '../commands/delete-model.command';
import { Store } from '@ngrx/store';
import { PROCESS } from '../../api/types';
import { OpenConfirmDialogAction } from '../../store/app.actions';
import { ContentType } from '../../api-implementations/acm-api/content-types';
class TestDeleteAction {
    type: 'delete';
    constructor(public payload: any) { }
}
class SpecificDeleteModelCommand extends GenericDeleteModelCommand {
    constructor(store: Store<any>, translationService: any) {
        super(store, translationService);
    }

    protected DeleteAction = TestDeleteAction;
}

describe('GenericDeleteModelCommand', () => {

    const translationServiceMock = { instant: jest.fn().mockReturnValue('test-title-translated') };

    it('should trigger the proper action on store when executed', () => {
        const mockStore = { dispatch: jest.fn() } as unknown as Store;
        const command = new SpecificDeleteModelCommand(mockStore, translationServiceMock);
        const modelId = 'test-id';

        command.execute(PROCESS, ContentType.Process, modelId);

        const dispatchedAction = new OpenConfirmDialogAction({
            dialogData: { title: 'test-title-translated' },
            action: new TestDeleteAction(modelId)
        });
        expect(translationServiceMock.instant).toHaveBeenCalled();
        expect(mockStore.dispatch).toHaveBeenCalledWith(dispatchedAction);
    });
});
