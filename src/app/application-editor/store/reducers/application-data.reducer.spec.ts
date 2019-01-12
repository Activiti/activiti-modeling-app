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

import { ApplicationDataState, INITIAL_APPLICATION_DATA_STATE } from 'ama-sdk';
import { applicationDataReducer } from './application-data.reducer';
import { SELECT_APPLICATION, GetApplicationSuccessAction } from '../actions/application';
import { Application } from 'ama-sdk';

describe('Application data reducer', () => {
    let initState: ApplicationDataState;

    it ('should handle SELECT_APPLICATION', () => {
        initState = {...INITIAL_APPLICATION_DATA_STATE};
        const newState = applicationDataReducer(initState, {type: SELECT_APPLICATION});

        expect(newState).toEqual(initState);
    });

    it ('should handle GET_APPLICATION_SUCCESS', () => {
        const application: Partial<Application> = {
            type: 'application',
            id: 'appid',
            name: 'appname'
        };
        initState = {...INITIAL_APPLICATION_DATA_STATE};
        const newState = applicationDataReducer(initState, new GetApplicationSuccessAction(application));

        expect(newState.datum).toEqual(application);
    });
});
