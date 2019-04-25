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

import { Action } from '@ngrx/store';
import { INITIAL_SETTINGS_STATE, AmaSettinsgState } from './../states/settings.state';
import { CHANGE_CONNECTOR_SETTINGS, ChangedConnectorSettingsAction } from './../../connector-editor/store/connector-editor.actions';
import { AppActionTypes, AsyncInitAction } from '../actions/app.actions';

export function settingsReducer(
    state: AmaSettinsgState = INITIAL_SETTINGS_STATE,
    action: Action
): AmaSettinsgState {
    switch (action.type) {
        case CHANGE_CONNECTOR_SETTINGS:
            return changedConnectorSettings(state, <ChangedConnectorSettingsAction> action);
        case AppActionTypes.AsyncInit:
            return loadFromLocalStorage(state, <AsyncInitAction> action);
        default:
            return { ...state };
    }
}

function changedConnectorSettings(state: AmaSettinsgState, action: ChangedConnectorSettingsAction): AmaSettinsgState {
    const newState = {...state, connectors: {showWithTemplate: action.isChecked}};
    return newState;
}

function loadFromLocalStorage(state: AmaSettinsgState, action: AsyncInitAction) {
    const newState = {...state, connectors: {showWithTemplate: action.config.showConnectorsWithTemplate}};
    return newState;
}
