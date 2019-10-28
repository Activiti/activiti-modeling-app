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

export class ProcessModel {
    '_attributes' = {
        id: '',
        name: '',
        isExecutable: ''
    };

    'bpmn2:documentation' = {};
    'bpmn2:startEvent' = {};

    constructor(details?: any) {
        if (details) {
            Object.assign(this['_attributes'], details['_attributes']);
            Object.assign(this['bpmn2:documentation'], details['bpmn2:documentation']);
            Object.assign(this['bpmn2:startEvent'], details['bpmn2:startEvent']);
        }
    }

    getId() {
        return this['_attributes'].id;
    }

    getName() {
        return this['_attributes'].name;
    }

    setName(name) {
        this['_attributes'].name = name;
    }
}
