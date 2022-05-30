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

export interface EntityDialogForm {
    id?: string;
    name: string;
    description?: string;
    projectId?: string;
}

export interface UploadFileAttemptPayload {
    file: File;
    projectId: string;
}

export interface AllowedCharacters {
    regex: RegExp;
    error: string;
}

export interface EntityDialogPayload {
    title: string;
    nameField: string;
    descriptionField: string;
    values?: EntityDialogForm;
    allowedCharacters?: AllowedCharacters;
    action: any;
    submitData?: any;
    navigateTo?: boolean;
    callback?: () => any;
    dialog?: any;
}
