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
import { ButtonType, CommandButton, CommandButtonRequest, CreateCommandButton, ShowCommandButton } from './command.model';

const iconMapping = {
    [BasicModelCommands.save]: 'cloud_done',
    [BasicModelCommands.validate]: 'done',
    [BasicModelCommands.download]: 'file_download',
    [BasicModelCommands.delete]: 'delete',
    [BasicModelCommands.saveAs]: 'save_as',
    [BasicModelCommands.moreMenu]: 'more_vert',
    [BasicModelCommands.editorsMenu]: 'remove_red_eye'
};

const priorityMapping = {
    [ButtonType.STANDARD]: [BasicModelCommands.save, BasicModelCommands.validate, BasicModelCommands.download],
    [ButtonType.MENU]: [BasicModelCommands.moreMenu, BasicModelCommands.editorsMenu, BasicModelCommands.saveAs, BasicModelCommands.delete]
};

export class ModelButtonService {

    private buttons: CreateCommandButton[] = [];

    public getCommandButtonFor(commandName: BasicModelCommands, action: ModelCommand, modelName: MODEL_TYPE): CommandButton {
        return {
            commandName,
            title: this.buildTitleForButton(modelName, commandName),
            icon: iconMapping[commandName],
            isSvgIcon: this.isSvgIcon(commandName),
            buttonType: ButtonType.STANDARD,
            action
        };
    }

    public getMenuButtonFor(commandName: BasicModelCommands, menuItems: CommandButtonRequest, modelName: MODEL_TYPE): CommandButton {
        const menuButtons: CommandButton[] = Object.keys(menuItems).map(item => {
            if (Object.values(BasicModelCommands).includes(<BasicModelCommands>item)) {
                return this.getCommandButtonFor(<BasicModelCommands>item, menuItems[item], modelName);
            }
            return menuItems[item];
        });
        return {
            commandName,
            title: this.buildTitleForButton(modelName, commandName),
            icon: iconMapping[commandName],
            isSvgIcon: this.isSvgIcon(commandName),
            buttonType: ButtonType.MENU,
            menuItems: menuButtons
        };
    }

    private buildTitleForButton(modelName: string, commandName: BasicModelCommands): string {
        let title = '';
        if (priorityMapping[ButtonType.MENU].includes(commandName)) {
            title = `APP.MENU.${this.formatValue(commandName)}`;
        } else {
            title = this.getFormattedModelName(modelName, commandName);
        }
        return title;
    }

    private getFormattedModelName(modelName: string, commandName: string): string {
        return `ADV_${this.formatValue(modelName)}_EDITOR.${this.formatValue(commandName)}_${this.formatValue(modelName)}`;
    }

    private formatValue(value: string): string {
        return value.toUpperCase().split('-').join('_');
    }

    public getStandardButtons(): ShowCommandButton[] {
        return this.buttons
            .filter((button) => button.buttonType === ButtonType.STANDARD)
            .map(commandButton => this.getShowCommandButtons(commandButton));
    }

    public getMenuButtons(): ShowCommandButton[] {
        return this.buttons
            .filter((button) => button.buttonType === ButtonType.MENU)
            .map(commandButton => {
                const menuItems = commandButton.createdMenuItems.map(button => this.getShowCommandButtons(button));
                return <ShowCommandButton>{
                    createdMenuItems: menuItems,
                    ...this.getShowCommandButtons(commandButton)
                };
            });
    }

    getShowCommandButtons(commandButton: CreateCommandButton): ShowCommandButton {
        return <ShowCommandButton>{
            ...commandButton,
            disabled$: commandButton.disabled$.asObservable(),
            visible$: commandButton.visible$.asObservable(),
            showIcon$: commandButton.showIcon$.asObservable(),
            updatedIcon$: commandButton.updatedIcon$.asObservable()
        };
    }

    public addStandardButton(commandButton: CommandButton) {
        this.buttons.push(this.getCreateCommandButtons(commandButton));
    }

    public addMenuButton(commandButton: CommandButton) {
        const menuItems = commandButton.menuItems.map(button => this.getCreateCommandButtons(button));
        this.buttons.push({
            createdMenuItems: menuItems,
            ...this.getCreateCommandButtons(commandButton)
        });
    }

    private getCreateCommandButtons(commandButton: CommandButton): CreateCommandButton {
        return <CreateCommandButton>{
            ...commandButton,
            disabled$: new BehaviorSubject<boolean>(false),
            visible$: new BehaviorSubject<boolean>(true),
            showIcon$: new BehaviorSubject<boolean>(true),
            updatedIcon$: new BehaviorSubject<string>(iconMapping[commandButton.commandName])
        };
    }

    public setDisable(commandName: BasicModelCommands, value: boolean) {
        const currentButton = this.getCurrentButton(commandName);
        currentButton.disabled$.next(value);
    }

    public setVisible(commandName: BasicModelCommands, value: boolean) {
        const currentButton = this.getCurrentButton(commandName);
        currentButton.visible$.next(value);
    }

    public setIconVisibility(commandName: BasicModelCommands, value: boolean) {
        const currentButton = this.getCurrentButton(commandName);
        currentButton.showIcon$.next(value);
    }

    public updateIcon(commandName: BasicModelCommands, value: string) {
        const currentButton = this.getCurrentButton(commandName);
        currentButton.updatedIcon$.next(value);
    }

    private getCurrentButton(commandName: BasicModelCommands): CreateCommandButton {
        let currentButton;
        this.buttons.find((button) => (button.buttonType === ButtonType.MENU) ?
            currentButton = button.createdMenuItems.find((menuItem) => menuItem.commandName === commandName) :
            (button.commandName === commandName) ? currentButton = button : false
        );
        return currentButton;
    }

    public isSvgIcon(commandName: string): boolean {
        return commandName === BasicModelCommands.saveAs;
    }
}
