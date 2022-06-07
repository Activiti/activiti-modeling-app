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

import { Observable, Subject } from 'rxjs';
import { BasicModelCommands, ModelCommand } from '../commands/commands.interface';

export enum ButtonType {
    STANDARD = 'standard',
    MENU = 'menu'
}

export interface CommandButton {
    commandName: BasicModelCommands;
    title: string;
    icon: string;
    isSvgIcon: boolean;
    buttonType: ButtonType;
    action?: ModelCommand;
    menuItems?: CommandButton[];
}
export interface CommandButtonRequest {
    [BasicModelCommands.save]?: ModelCommand;
    [BasicModelCommands.delete]?: ModelCommand;
    [BasicModelCommands.download]?: ModelCommand;
    [BasicModelCommands.validate]?: ModelCommand;
    [BasicModelCommands.saveAs]?: ModelCommand;
}

export interface MenuButtonRequest {
    [BasicModelCommands.moreMenu]?: CommandButtonRequest;
    [BasicModelCommands.editorsMenu]?: CommandButtonRequest;
}

export interface ShowCommandButton extends CommandButton {
    createdMenuItems?: ShowCommandButton[];
    disabled$: Observable<boolean>;
    visible$: Observable<boolean>;
    showIcon$: Observable<boolean>;
    updatedIcon$: Observable<string>;
}

export interface CreateCommandButton extends CommandButton {
    createdMenuItems?: CreateCommandButton[];
    disabled$: Subject<boolean>;
    visible$: Subject<boolean>;
    showIcon$: Subject<boolean>;
    updatedIcon$: Subject<string>;
}
