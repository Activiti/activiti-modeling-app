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

import { AmaSettingsState, INITIAL_SETTINGS_STATE } from '../states/settings.state';
import { settingsReducer } from './settings.reducer';
import { CHANGE_CONNECTOR_SETTINGS, ChangedConnectorSettingsAction } from './../../connector-editor/store/connector-editor.actions';
import { AsyncInitAction, AppActionTypes } from '../actions/app.actions';

describe('settingsReducer', () => {
    const initialState: AmaSettingsState = INITIAL_SETTINGS_STATE;

    it ('should handle CHANGE_CONNECTOR_SETTINGS', () => {
        const action =  <ChangedConnectorSettingsAction>{ type: CHANGE_CONNECTOR_SETTINGS, isChecked: true };
        const newState = settingsReducer(initialState, action);

        expect(newState.connectors.showWithTemplate).toBe(true);
    });

    it ('should handle AsyncInitAction', () => {
        const action =  <AsyncInitAction>{ type: AppActionTypes.AsyncInit, config: <any>{
            selectedTheme: '',
            menuOpened: null,
            showConnectorsWithTemplate: true
        }};
        const newState = settingsReducer(initialState, action);

        expect(newState.connectors.showWithTemplate).toBe(true);
    });
});
