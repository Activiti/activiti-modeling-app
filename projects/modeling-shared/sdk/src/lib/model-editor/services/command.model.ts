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

export enum CommandButtonPriority { PRIMARY, SECONDARY }

export interface CommandButton {
    commandName: BasicModelCommands;
    title: string;
    icon: string;
    priority: CommandButtonPriority;
    isSvgIcon: boolean;
    action: ModelCommand;
}
export interface CommandButtonRequest {
    [BasicModelCommands.save]?: ModelCommand;
    [BasicModelCommands.delete]?: ModelCommand;
    [BasicModelCommands.download]?: ModelCommand;
    [BasicModelCommands.validate]?: ModelCommand;
    [BasicModelCommands.saveAs]?: ModelCommand;
}

export interface ShowCommandButton extends CommandButton {
    disabled$: Observable<boolean>;
    visible$: Observable<boolean>;
}

export interface CreateCommandButton extends CommandButton {
    disabled$: Subject<boolean>;
    visible$: Subject<boolean>;
}
