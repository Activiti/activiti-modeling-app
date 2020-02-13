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

export const NO_PROCESS_VARIABLES_ERROR = 'no-process-variables-error';
export const NO_SUBPROCESS_VARIABLES_ERROR = 'no-subprocess-variables-error';
export const NO_FORM_FIELDS_FOR_INPUT_ERROR = 'no-form-fields-for-input-error';
export const NO_FORM_FIELDS_FOR_OUTPUT_ERROR = 'no-form-fields-for-output-error';

export const SEND_ALL_VARIABLES_OPTION = 'Send all variables';
export const SEND_NO_VARIABLES_OPTION = `Don't send variables`;

export const MODEL_NAME_REGEXP = '^[a-z]([-a-z0-9]{0,24}[a-z0-9])?$';

export const NO_MATCHING_TYPE_VARIABLES = 'Create a form variable of the same data type to compare against';
export const NO_MATCHING_TYPE_FIELDS = 'Create a field of the same data type to compare against';
export const INVALID_NAME_ERROR = `The name must be in lowercase and between 1 and 26 characters in length. ` +
`Alphanumeric characters and hyphens are allowed, however the name must begin with a letter and end alphanumerically.`;
export const DMN_SIMULATION_SUCCESS = `Decision table simulation successful`;
export const DMN_SIMULATION_NO_RESULT = `Decision table simulation had no results`;
export const MULTIPLE_MATCHING_RULES_UNIQUE_HIT_POLICY = `UNIQUE hit policy decision tables can only have one matching rule. ` +
    `Multiple matches found for decision table 'Decision_decision-dennis'. Matched rules: [1, 2, 3] ERROR`;

export const MAPPING_DIALOG_TITLE = 'Edit variable mapping';

export const COLLABORATOR_ADDED = `Collaborator added`;
export const COLLABORATOR_DUPLICATED = `The selected collaborator is already in the list`;
