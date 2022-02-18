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

import { BasicModelCommands, CommandButton, CommandButtonPriority, ModelCommandsService, PROCESS } from '@alfresco-dbp/modeling-shared/sdk';
import { Injectable } from '@angular/core';
import { DeleteProcessCommand } from './delete-process.command';
import { DownloadProcessCommand } from './download-process.command';
import { SaveProcessCommand } from './save-process.command';
import { ValidateProcessCommand } from './validate-process.command';
import { SaveAsProcessCommand } from './save-as-process.command';
import { DownloadProcessSVGImageCommand } from './download-process-svg-image.command';

@Injectable()
export class ProcessCommandsService extends ModelCommandsService {
    public static readonly DOWNLOAD_PROCESS_SVG_IMAGE_COMMAND_BUTTON = 'download-svg-image';

    constructor(
        saveCommand: SaveProcessCommand,
        deleteCommand: DeleteProcessCommand,
        validateCommand: ValidateProcessCommand,
        downloadCommand: DownloadProcessCommand,
        saveAsCommand: SaveAsProcessCommand,
        downloadProcessSvgImageCommand: DownloadProcessSVGImageCommand
    ) {
        super();

        const downloadProcessSvgImageCommandButton: CommandButton = {
            commandName: <BasicModelCommands> ProcessCommandsService.DOWNLOAD_PROCESS_SVG_IMAGE_COMMAND_BUTTON,
            title: 'ADV_PROCESS_EDITOR.SAVE_PROCESS_IMAGE',
            icon: 'image',
            priority: CommandButtonPriority.PRIMARY,
            isSvgIcon: false,
            action: downloadProcessSvgImageCommand
        };

        [
            downloadProcessSvgImageCommandButton,
            ...this.getBasicModelCommands({
                [BasicModelCommands.save] : saveCommand,
                [BasicModelCommands.delete]: deleteCommand,
                [BasicModelCommands.download]: downloadCommand,
                [BasicModelCommands.validate]: validateCommand,
                [BasicModelCommands.saveAs]: saveAsCommand
            }, PROCESS)
        ].forEach(command => this.registerCommand(command));
    }
}
