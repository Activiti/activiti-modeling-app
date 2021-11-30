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

import { AbstractControl, ValidatorFn } from '@angular/forms';

export const PROCESS_FILE_FORMAT = '.bpmn20.xml';
export const PROCESS_SVG_FILE_FORMAT = '.svg';
export const CONNECTOR_FILE_FORMAT = '.json';
export const FORM_FILE_FORMAT = '.json';
export const UI_FILE_FORMAT = '.json';
export const DECISION_TABLE_FILE_FORMAT = '.dmn';
export const FILE_FILE_FORMAT = '.bin';
export const SCRIPT_FILE_FORMAT = '.bin';
export const TRIGGER_FILE_FORMAT = '.json';
export const CONTENT_MODEL_FILE_FORMAT = '.xml';
export const FORM_WIDGET_FILE_FORMAT = '.json';
export const MODEL_NAME_CHARACTERS = 'a-z0-9-';
export const MODELER_NAME_REGEX = /^[a-z]([-a-z0-9]{0,24}[a-z0-9])?$/;
export const FIELD_VARIABLE_NAME_REGEX = /^[a-z][a-z0-9_]*$/i;

export const sanitizeString = (text: string) => {
    const pastedText = text,
        negativeRegex = new RegExp(`[^${MODEL_NAME_CHARACTERS}]`, 'g'),
        sanitizedValue = pastedText.replace(negativeRegex, '').replace(/\s/g, '');
    return sanitizedValue;
};

export const createModelName = (name) => {
    return sanitizeString(name.replace(PROCESS_FILE_FORMAT, ''));
};

export const createDecisionTableName = (name) => {
    return sanitizeString(name.replace(DECISION_TABLE_FILE_FORMAT, ''));
};

export const changeFileName = (file: File, newName: string): File => {
    const blob = file.slice(0, file.size, file.type);
    return new File([blob], newName, { type: file.type });
};

export const formatUuid = (contentType: string, uuid: string): string => {
    return `${contentType.toLowerCase()}-${uuid}`;
};

/* cspell: disable-next-line */
export const getRandomCharsAndNums = (noOfCharStringLengths: number): string => {
    return Math.random().toString(36).replace(/[^a-z0-9]+/g, '').substr(0, noOfCharStringLengths);
};

export const variableNameValidator = (): ValidatorFn => {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const isTemplateNameValid = MODELER_NAME_REGEX.test(control.value) && control.value.length > 0;
        return !isTemplateNameValid ? { 'invalidVariableName': { value: control.value } } : null;
    };
};

export const availableVariableValidator = (variableNames: string[]): ValidatorFn => {
    return (control: AbstractControl): { [key: string]: any } | null => {
        return variableNames.includes(control.value) ? { 'takenVariableName': { value: control.value } } : null;
    };
};
