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
import { Connector } from 'ama-sdk';

const lambdaConnector = require('./json/lambda.json');
const camelConnector = require('./json/camel.json');
const emailConnector = require('./json/email.json');
const restConnector = require('./json/rest.json');
const salesforceConnector = require('./json/salesforce.json');
const twilioConnector = require('./json/twilio.json');

@Injectable()
export class OobConnectorsService {
    constructor() {}

    private oobConnectors = [
        twilioConnector,
        lambdaConnector,
        camelConnector,
        emailConnector,
        restConnector,
        salesforceConnector
    ];

    getMetadata(): Connector[] {
        return this.oobConnectors.reduce((metadata, connector) => {
            const { id, name, description } = connector;
            return [ ...metadata, { id, name, description } ];
        }, []);
    }

    getByName(connectorName: string) {
        return this.oobConnectors.find(connector => connector.name === connectorName);
    }

    getById(connectorId: string) {
        return this.oobConnectors.find(connector => connector.id === connectorId);
    }

    isOobConnector(connectorId: string): boolean {
        return !!this.getById(connectorId);
    }

}
