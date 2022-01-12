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

import { BasicModelCommands, ModelCommandsService } from '@alfresco-dbp/modeling-shared/sdk';
import { Injectable } from '@angular/core';
import { DeleteProcessCommand } from './delete-process.command';
import { DownloadProcessCommand } from './download-process.command';
import { SaveProcessCommand } from './save-process.command';
import { ValidateProcessCommand } from './validate-process.command';
import { SaveAsProcessCommand } from './save-as-process.command';

@Injectable()
export class ProcessCommandsService extends ModelCommandsService {
    constructor(
        saveCommand: SaveProcessCommand,
        deleteCommand: DeleteProcessCommand,
        validateCommand: ValidateProcessCommand,
        downloadCommand: DownloadProcessCommand,
        saveAsCommand: SaveAsProcessCommand,
    ) {
        super();

        [
            { eventName: BasicModelCommands.save, command: saveCommand },
            { eventName: BasicModelCommands.delete, command: deleteCommand },
            { eventName: BasicModelCommands.validate, command: validateCommand },
            { eventName: BasicModelCommands.download, command: downloadCommand },
            { eventName: BasicModelCommands.saveAs, command: saveAsCommand },
        ].forEach(eventMethod => this.addEventListener(eventMethod.eventName, eventMethod.command));
    }
}
