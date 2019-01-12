 /*!
 * @license
 * Copyright 2018 Alfresco, Inc. and/or its affiliates.
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
import {
    DashboardState,
    INITIAL_DASHBOARD_STATE,
    ApplicationSummaryEntities
} from '../state/dashboard.state';
import {
    GET_APPLICATIONS_SUCCESS,
    GetApplicationsSuccessAction,
    CreateApplicationSuccessAction,
    CREATE_APPLICATION_SUCCESS,
    UPDATE_APPLICATION_SUCCESS,
    UpdateApplicationSuccessAction,
    DELETE_APPLICATION_SUCCESS,
    DeleteApplicationSuccessAction,
    UploadApplicationSuccessAction,
    UPLOAD_APPLICATION_SUCCESS
} from '../actions/applications';

export function dashboardReducer(state: DashboardState = INITIAL_DASHBOARD_STATE, action: Action): DashboardState {
    let newState: DashboardState;

    switch (action.type) {

        case GET_APPLICATIONS_SUCCESS:
            newState = setApplications(state, <GetApplicationsSuccessAction>action);
            break;

        case CREATE_APPLICATION_SUCCESS:
            newState = createApplication(state, <CreateApplicationSuccessAction>action);
            break;

        case UPDATE_APPLICATION_SUCCESS:
            newState = updateApplication(state, <UpdateApplicationSuccessAction>action);
            break;

        case DELETE_APPLICATION_SUCCESS:
            newState = deleteApplication(state, <DeleteApplicationSuccessAction>action);
            break;

        case UPLOAD_APPLICATION_SUCCESS:
            newState = uploadApplication(state, <UploadApplicationSuccessAction> action);
            break;

        default:
            newState = Object.assign({}, state);
    }

    return newState;
}

function setApplications(state: DashboardState, action: GetApplicationsSuccessAction): DashboardState {
    const newState = Object.assign({}, state);
    newState.applicationsLoaded = true;
    newState.applications = action.payload.reduce<ApplicationSummaryEntities>((applications, application) => {
        return { ...applications, [application.id]: application };
    }, {});

    return newState;
}

function createApplication(state: DashboardState, action: CreateApplicationSuccessAction): DashboardState {
    const newState = Object.assign({}, state);
    const application = action.payload;
    newState.applications = {
        ...state.applications,
        [application.id]: application
    };
    return newState;
}

function updateApplication(state: DashboardState, action: UpdateApplicationSuccessAction): DashboardState {
    const newState = Object.assign({}, state);
    const application = action.payload;
    newState.applications = {
        ...state.applications,
        [application.id]: { ...newState.applications[application.id], ...application }
    };
    return newState;
}

function deleteApplication(state: DashboardState, action: DeleteApplicationSuccessAction): DashboardState {
    const newState = { ...state };

    newState.applications = { ...state.applications };
    delete newState.applications[action.payload];

    return newState;
}

function uploadApplication(state: DashboardState, action: UploadApplicationSuccessAction): DashboardState {
    const newState = Object.assign({}, state);
    const application = action.payload;
    newState.applications = {
        ...state.applications,
        [application.id]: application
    };
    return newState;
}
