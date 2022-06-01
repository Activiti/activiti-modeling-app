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

export function createBlobFormData(file: Blob, fileName: string) {
    const formData = new FormData();
    formData.append('file', file, fileName);
    return formData.get('file');
}

export function createBlobFormDataFromStringContent(fileContent: string, fileName: string, type = 'application/json') {
    const formData = new FormData(),
        file = new Blob([fileContent], { type: type });
    formData.append('file', file, fileName);

    return formData.get('file');
}
