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
import { UPDATE_SETTINGS, UpdateSettingsAction, SET_MENU, SetMenuAction } from '../actions';
import { INITIAL_APP_STATE } from '../states/app.state';
import { SELECT_PROJECT, SelectProjectAction } from '../../project-editor/store/project-editor.actions';
import { appThemes } from '../../app/themes';
import {
    AppActionTypes,
    AsyncInitAction,
    TOOLBAR_MESSAGE,
    ToolbarMessageAction,
    CLEAR_LOG_HISTORY,
    SET_LOG_HISTORY_VISIBILITY,
    SetLogHistoryVisibilityAction
} from '../actions/app.actions';
import {
    AppState,
    SET_APP_DIRTY_STATE,
    SetAppDirtyStateAction,
    MODEL_OPENED,
    ModelOpenedAction,
    MODEL_CLOSED,
    ModelClosedAction
} from 'ama-sdk';
import { LOG_ACTION, LogAction } from 'ama-sdk';

import { PROCESS_EDITOR_LOGS } from './../../process-editor/services/process-editor.constants';

export function appReducer(state: AppState = INITIAL_APP_STATE, action: Action): AppState {
    let newState: AppState;

    switch (action.type) {
        case AppActionTypes.AsyncInit:
            newState = asyncInit(state, <AsyncInitAction>action);
            break;
        case UPDATE_SETTINGS:
            newState = updateSettings(state, <UpdateSettingsAction>action);
            break;

        case SET_MENU:
            newState = setMenuState(state, <SetMenuAction>action);
            break;

        case SELECT_PROJECT:
            newState = selectProject(state, <SelectProjectAction>action);
            break;

        case MODEL_OPENED:
            newState = selectOpenedModel(state, <ModelOpenedAction>action);
            break;

        case MODEL_CLOSED:
            newState = deselectOpenedModel(state, <ModelClosedAction>action);
            break;

        case SET_APP_DIRTY_STATE:
            newState = setDirtyState(state, <SetAppDirtyStateAction>action);
            break;

         case TOOLBAR_MESSAGE:
            return {
                    ...state,
                    toolbar: {
                        ...state.toolbar,
                        userMessage: (<ToolbarMessageAction>action).message
                    }
                };

        case LOG_ACTION:
            return storeLog(state, <LogAction> action);

        case CLEAR_LOG_HISTORY:
            return {
                ...state,
                logs: []
            };

        case SET_LOG_HISTORY_VISIBILITY:
            return {
                ...state,
                toolbar: {
                    ...state.toolbar,
                    logHistoryVisible: (<SetLogHistoryVisibilityAction>action).visible
                    }
                };

        default:
            newState = Object.assign({}, state);
    }

    return newState;
}

function setDirtyState(state: AppState, action: SetAppDirtyStateAction): AppState {
    return { ...state, dirtyState: action.payload };
}

function asyncInit(state: AppState, action: AsyncInitAction): AppState {
    const menuOpened = action.config.menuOpened;

    return {
        ...state,
        selectedTheme: action.config.selectedTheme,
        ...(menuOpened !== null ? { menuOpened } : {})
    };
}

function updateSettings(state: AppState, action: UpdateSettingsAction): AppState {
    const newState = Object.assign({}, state);
    newState.selectedTheme = appThemes.find(appTheme => appTheme.className === action.payload.theme);
    return newState;
}

function setMenuState(state: AppState, action: SetMenuAction): AppState {
    const newState = Object.assign({}, state);
    newState.menuOpened = action.payload;
    return newState;
}

function selectProject(state: AppState, action: SelectProjectAction): AppState {
    const newState = Object.assign({}, state);
    newState.selectedProjectId = action.payload;
    newState.openedModel = null;
    return newState;
}

function selectOpenedModel(state: AppState, action: ModelOpenedAction): AppState {
    const newState = Object.assign({}, state);
    newState.openedModel = action.model;
    return newState;
}

function deselectOpenedModel(state: AppState, action: ModelClosedAction): AppState {
    const newState = Object.assign({}, state);
    newState.openedModel = null;
    return newState;
}

function storeLog(state: AppState, action: LogAction): AppState {
    if (action.log.initiator.key !== PROCESS_EDITOR_LOGS) {
        return state;
    }

    return {
        ...state,
        toolbar: {
            ...state.toolbar,
        },
        logs: [
            action.log,
            ...state.logs
        ]
    };
}
