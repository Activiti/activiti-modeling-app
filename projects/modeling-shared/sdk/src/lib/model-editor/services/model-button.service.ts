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

import { BehaviorSubject} from 'rxjs';
import { MODEL_TYPE } from '../../api/types';
import { BasicModelCommands, ModelCommand } from '../commands/commands.interface';
import { CommandButton, CommandButtonPriority, CreateCommandButton, ShowCommandButton } from './command.model';

const iconMapping = {
    [BasicModelCommands.save]: 'save',
    [BasicModelCommands.validate]: 'done',
    [BasicModelCommands.download]: 'file_download',
    [BasicModelCommands.delete]: 'delete',
    [BasicModelCommands.saveAs]: 'save-as',
};

const priorityMapping = {
    [CommandButtonPriority.PRIMARY]: [BasicModelCommands.save, BasicModelCommands.validate, BasicModelCommands.download],
    [CommandButtonPriority.SECONDARY]: [BasicModelCommands.saveAs, BasicModelCommands.delete]
};

export class ModelButtonService {

    private buttons: CreateCommandButton[] = [];

    public getCommandButtonFor(commandName: BasicModelCommands, action: ModelCommand, modelName: MODEL_TYPE): CommandButton {
        return {
            commandName,
            title: this.buildTitleForButton(modelName, commandName),
            icon: iconMapping[commandName],
            priority: this.getButtonPriority(commandName),
            isSvgIcon: this.isSvgIcon(commandName),
            action
        };
    }

    private buildTitleForButton(modelName: string, commandName: BasicModelCommands): string {
        let title = '';
        if (priorityMapping[CommandButtonPriority.PRIMARY].includes(commandName)) {
            title = this.getFormattedModelName(modelName, commandName);
        } else {
            title = `APP.MENU.${this.formatValue(commandName)}`;
        }
        return title;
    }

    private getFormattedModelName(modelName: string, commandName: string): string {
        return `ADV_${this.formatValue(modelName)}_EDITOR.${commandName.toUpperCase()}_${this.formatValue(modelName)}`;
    }

    private formatValue(value: string): string {
        return value.toUpperCase().replace('-', '_');
    }

    private getButtonPriority(commandName: BasicModelCommands): CommandButtonPriority {
        return !!priorityMapping[CommandButtonPriority.PRIMARY].includes(commandName) ? CommandButtonPriority.PRIMARY : CommandButtonPriority.SECONDARY;
    }

    public getCommandButtons(priority?: CommandButtonPriority): ShowCommandButton[] {
        return this.buttons
            .filter((button) => button.priority === priority)
            .map(commandButton => {
                return <ShowCommandButton>{
                    ...commandButton,
                    disabled$: commandButton.disabled$.asObservable(),
                    visible$: commandButton.visible$.asObservable()
                };
            });
    }

    public addButton(commandButton: CommandButton) {
        this.buttons.push({
            ...commandButton,
            disabled$: new BehaviorSubject<boolean>(false),
            visible$: new BehaviorSubject<boolean>(true)
        });
    }

    public setDisable(commandName: BasicModelCommands, value: boolean) {
        const currentButton = this.buttons.find((button) => button.commandName === commandName);
        currentButton.disabled$.next(value);
    }

    public isSvgIcon(commandName: string): boolean {
        return commandName === BasicModelCommands.saveAs;
    }
}
