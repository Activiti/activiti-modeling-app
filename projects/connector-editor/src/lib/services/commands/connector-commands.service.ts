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

import { ModelCommandsService, BasicModelCommands, CONNECTOR } from '@alfresco-dbp/modeling-shared/sdk';
import { Injectable } from '@angular/core';
import { DeleteConnectorCommand } from './delete-connector.command';
import { SaveAsConnectorCommand } from './save-as-connector.command';
import { DownloadConnectorCommand } from './download-connector.command';
import { SaveConnectorCommand } from './save-connector.command';
import { ValidateConnectorCommand } from './validate-connector.command';

@Injectable()
export class ConnectorCommandsService extends ModelCommandsService {
    constructor(
        saveCommand: SaveConnectorCommand,
        deleteCommand: DeleteConnectorCommand,
        saveAsCommand: SaveAsConnectorCommand,
        downloadCommand: DownloadConnectorCommand,
        validateCommand: ValidateConnectorCommand
        ) {
        super();

        [
            ...this.getBasicStandardCommands({
                [BasicModelCommands.save] : saveCommand,
                [BasicModelCommands.download]: downloadCommand,
                [BasicModelCommands.validate]: validateCommand
            }, CONNECTOR),
            ...this.getBasicMenuCommands({
                [BasicModelCommands.moreMenu] : {
                    [BasicModelCommands.saveAs]: saveAsCommand,
                    [BasicModelCommands.delete]: deleteCommand
                }
            }, CONNECTOR)
        ].forEach(command => this.registerCommand(command));
    }
}
