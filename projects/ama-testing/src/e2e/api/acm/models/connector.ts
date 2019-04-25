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

import { ACMCrud } from '../acm-crud';
const uuidv4 = require('uuid/v4');

export class ACMConnector extends ACMCrud {

    displayName = 'connector';
    namePrefix = 'qaconnector';
    type = 'CONNECTOR';
    contentType = 'application/json';

    getDefaultContent(entityName: string, entityId: string) {
        return JSON.stringify({
            name: entityName
        });
    }
}

export class ConnectorParameter {
    id: string;
    name: string;
    description: string;
    type: string;
    required: boolean;

    constructor(name: string, type: string, description?: string, required?: boolean) {
        this.id = uuidv4();
        this.name = name;
        this.description = description;
        this.type = type;
        this.required = required;
    }
}

export class ConnectorAction {
    id: string;
    name: string;
    description?: string;
    inputs?: ConnectorParameter[];
    outputs?: ConnectorParameter[];

    constructor(name: string, description?: string, inputs?: ConnectorParameter[], outputs?: ConnectorParameter[]) {
        this.id = uuidv4();
        this.name = name;
        this.description = description;
        this.inputs = inputs;
        this.outputs = outputs;
    }
}
