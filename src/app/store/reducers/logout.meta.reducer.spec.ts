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

import { logoutMetaReducer } from './logout.meta.reducer';
import { INITIAL_APP_STATE } from '../states/app.state';
import { AppActionTypes } from '../actions/app.actions';

describe('logoutMetaReducer', () => {
    let logoutReducer: any;
    const state = {
        /* cspell: disable-next-line */
        whatever: 'Badabooom'
    };

    const testReducer = (currentState, action) => ({ ...currentState, reducerCalledWith: action.message });

    beforeEach(() => {
        logoutReducer = logoutMetaReducer(testReducer);
    });

    it('should return the state, with the testReducer applied on it, if the action is NOT the logout action', () => {
        const expectedMessage = 'Meow',
            action = { type: 'Not logout, not at all', message: expectedMessage };

        const newState = logoutReducer(state, action);

        expect(newState).toEqual({
            ...state,
            reducerCalledWith: expectedMessage
        });
    });

    it('should return the INITIAL_APP_STATE, with the testReducer applied on it, if the action is the logout action', () => {
        const expectedMessage = 'Meow',
            action = { type: AppActionTypes.Logout, message: expectedMessage };

        const newState = logoutReducer(state, action);

        expect(newState).toEqual({
            ...INITIAL_APP_STATE,
            reducerCalledWith: expectedMessage
        });
    });
});
