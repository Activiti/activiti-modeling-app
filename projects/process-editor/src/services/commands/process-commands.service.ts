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

import { BasicModelCommands, ButtonType, CommandButton, ModelCommandsService, PROCESS } from '@alfresco-dbp/modeling-shared/sdk';
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
    public static readonly DIAGRAM_MENU_ITEM = 'diagram-menu-item';
    public static readonly EXTENSIONS_MENU_ITEM = 'extensions-menu-item';
    public static readonly XML_MENU_ITEM = 'xml-menu-item';

    constructor(
        saveCommand: SaveProcessCommand,
        deleteCommand: DeleteProcessCommand,
        validateCommand: ValidateProcessCommand,
        downloadCommand: DownloadProcessCommand,
        saveAsCommand: SaveAsProcessCommand,
        downloadProcessSvgImageCommand: DownloadProcessSVGImageCommand,
    ) {
        super();

        const selectProcessEditorTab = (index: number) => {
            this.setTabIndex(index);
        };

        const downloadProcessSvgImageCommandButton: CommandButton = {
            commandName: <BasicModelCommands> ProcessCommandsService.DOWNLOAD_PROCESS_SVG_IMAGE_COMMAND_BUTTON,
            title: 'ADV_PROCESS_EDITOR.SAVE_PROCESS_IMAGE',
            icon: 'image',
            isSvgIcon: false,
            buttonType: ButtonType.STANDARD,
            action: downloadProcessSvgImageCommand
        };

        const diagramMenuItemCommandButton: CommandButton = {
            commandName: <BasicModelCommands> ProcessCommandsService.DIAGRAM_MENU_ITEM,
            title: 'PROCESS_EDITOR.TABS.DIAGRAM_EDITOR',
            icon: 'done',
            isSvgIcon: false,
            buttonType: ButtonType.STANDARD,
            action: { execute: () =>  selectProcessEditorTab(0)}
        };

        const xmlMenuItemCommandButton: CommandButton = {
            commandName: <BasicModelCommands> ProcessCommandsService.XML_MENU_ITEM,
            title: 'PROCESS_EDITOR.TABS.RAW_EDITOR',
            icon: 'done',
            isSvgIcon: false,
            buttonType: ButtonType.STANDARD,
            action: { execute: () =>  selectProcessEditorTab(1) }
        };

        const extensionsMenuItemCommandButton: CommandButton = {
            commandName: <BasicModelCommands> ProcessCommandsService.EXTENSIONS_MENU_ITEM,
            title: 'PROCESS_EDITOR.TABS.EXTENSIONS_EDITOR',
            icon: 'done',
            isSvgIcon: false,
            buttonType: ButtonType.STANDARD,
            action: { execute: () =>  selectProcessEditorTab(2)}
        };

        [
            ...this.getBasicStandardCommands({
                [BasicModelCommands.save]: saveCommand,
                [BasicModelCommands.validate]: validateCommand
            }, PROCESS),
            ...this.getBasicMenuCommands({
                [BasicModelCommands.editorsMenu]: {
                    [diagramMenuItemCommandButton.commandName]: diagramMenuItemCommandButton,
                    [xmlMenuItemCommandButton.commandName]: xmlMenuItemCommandButton,
                    [extensionsMenuItemCommandButton.commandName]: extensionsMenuItemCommandButton
                },
                [BasicModelCommands.moreMenu]: {
                    [BasicModelCommands.saveAs]: saveAsCommand,
                    [BasicModelCommands.download]: downloadCommand,
                    [BasicModelCommands.delete]: deleteCommand,
                    [downloadProcessSvgImageCommandButton.commandName]: downloadProcessSvgImageCommandButton
                }
            }, PROCESS)
        ].forEach(command => this.registerCommand(command));
    }
}
