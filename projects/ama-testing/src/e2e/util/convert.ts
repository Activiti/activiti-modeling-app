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

const convert = require('xml-js');
const options = { compact: true, spaces: 4 };

/**
 * Converts XML text to the JavaScript object
 */
export const xml2js = (xml: string): any => {
    return convert.xml2js(xml, options);
};

/**
 * Converts XML text to the JSON text
 */
export const xml2json = (xml: string): string => {
    return convert.xml2json(xml, options);
};

/**
 * Converts JSON object to XML text
 */
export const js2xml = (obj: any): string => {
    return convert.js2xml(obj, options);
};
