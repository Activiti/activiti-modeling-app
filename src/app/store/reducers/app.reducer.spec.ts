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

import { appReducer } from './app.reducer';
import { PROCESS, ModelOpenedAction, MODEL_OPENED, ModelClosedAction, MODEL_CLOSED, SetApplicationLoadingStateAction, LOADED_APPLICATION } from '@alfresco-dbp/modeling-shared/sdk';
import { SelectProjectAction } from '../../project-editor/store/project-editor.actions';

describe('appReducer', () => {

    it('should set selectedModel to the latest one if no model is selected yet', () => {
        const selectedModel = { id: '1', type: PROCESS };
        const mockAction = <ModelOpenedAction>{ type: MODEL_OPENED, model: selectedModel };
        const newState = appReducer(undefined, mockAction);

        expect(newState.openedModel).toEqual(selectedModel);
    });

    it('should set selectedModel to the latest one if a model is already selected', () => {
        const selectedModel1 = { id: '1', type: PROCESS };
        const selectedModel2 = { id: '2', type: PROCESS };
        const mockAction1 = <ModelOpenedAction>{ type: MODEL_OPENED, model: selectedModel1 };
        const mockAction2 = <ModelOpenedAction>{ type: MODEL_OPENED, model: selectedModel2 };
        const newState1 = appReducer(undefined, mockAction1);
        const newState = appReducer(newState1, mockAction2);

        expect(newState.openedModel).toEqual(selectedModel2);
    });

    it('should unset selectedModel to the latest one if a model is already selected', () => {
        const selectedModel = { id: '1', type: PROCESS };
        const mockAction1 = <ModelOpenedAction>{ type: MODEL_OPENED, model: selectedModel };
        const mockAction2 = <ModelClosedAction>{ type: MODEL_CLOSED, model: selectedModel };
        const newState1 = appReducer(undefined, mockAction1);
        const newState = appReducer(newState1, mockAction2);

        expect(newState.openedModel).toEqual(null);
    });

    it('should unset selectedModel when selecting (a new) project', () => {
        const selectedModel = { id: '1', type: PROCESS };
        const mockAction = <ModelOpenedAction>{ type: MODEL_OPENED, model: selectedModel };
        const initialState = appReducer(undefined, mockAction);

        const selectAppAction = new SelectProjectAction('app-id');
        const newState = appReducer(initialState, selectAppAction);

        expect(newState.openedModel).toEqual(null);
    });

    it('should handle LOADED_APPLICATION with true as parameter', () => {
        const action = <SetApplicationLoadingStateAction>{ type: LOADED_APPLICATION, loading: true };
        const initialState = appReducer(undefined, action);
        const newState = appReducer(initialState, action);
        expect (newState.toolbar.inProgress).toBe(true);
    });

    it('should handle LOADED_APPLICATION with false as parameter', () => {
        const action = <SetApplicationLoadingStateAction>{ type: LOADED_APPLICATION, loading: false };
        const initialState = appReducer(undefined, action);
        const newState = appReducer(initialState, action);
        expect (newState.toolbar.inProgress).toBe(false);
    });
});
