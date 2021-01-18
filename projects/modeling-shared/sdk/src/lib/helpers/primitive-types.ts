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

export const primitive_types: string[] = [
    'string',
    'integer',
    'boolean',
    'date',
    'datetime',
    'file',
    'json',
    'folder',
    'array'
];

export const AMA_DATETIME_FORMATS = {
    parse: {
        dateInput: 'L',
        monthInput: 'MMMM',
        timeInput: 'HH:mm:ss',
        datetimeInput: 'YYYY-MM-DD HH:mm:ss'
    },
    display: {
        dateInput: 'L',
        monthInput: 'MMMM',
        datetimeInput: 'YYYY-MM-DD HH:mm:ss',
        timeInput: 'LTS',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'HH:mm:ss',
        monthYearA11yLabel: 'MMMM YYYY',
        popupHeaderDateLabel: 'ddd, DD MMM'
    }
};

/* cspell: disable-next-line */
export const MOMENT_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
export const ANGULAR_DATETIME_DISPLAY_FORMAT = 'yyyy-MM-ddTHH:mm:ss';
export const EXPRESSION = 'expression';

export const FORM_DIALOG_COLUMNS: string[] = [
    'name',
    'type',
    'value',
    'delete'
];
