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

import { Injectable } from '@angular/core';

export interface ValidationResponse<T> {
    json: T;
    valid: boolean;
    error: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class CodeValidatorService {

    validateJson<T>(jsonString: string = ''): ValidationResponse<T> {
        let json, validationResponse: ValidationResponse<T>;
        try {
            json = JSON.parse(jsonString.trim());
            return { json, valid: true, error: null };
        } catch {
            validationResponse = { json: null, valid: false, error: 'APP.GENERAL.ERRORS.NOT_VALID_JSON' };
        }

        return validationResponse;
    }
}
