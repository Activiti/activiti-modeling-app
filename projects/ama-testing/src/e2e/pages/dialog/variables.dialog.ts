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

import { element, by } from 'protractor';
import { GenericDialog } from '../common/generic.dialog';
import { Calendar } from '../calendar';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class VariablesDialog extends GenericDialog {

    readonly variablesDialog = element(by.css(`[data-automation-id="variables-dialog"]`));
    readonly variablesDialogTitleIcon = element(by.cssContainingText(`.mat-dialog-title mat-icon`, 'layers'));
    readonly add = element(by.css(`[data-automation-id="add-variable"]`));
    readonly delete = element(by.css(`[data-automation-id="delete-variable"]`));
    readonly name = element(by.css(`[data-automation-id="variable-name"]`));
    readonly type = element(by.css(`[data-automation-id="variable-type"]`));
    readonly value = element(by.css(`[data-automation-id="variable-value"]`));
    readonly datePicker = element(by.className('mat-datepicker-toggle'));
    readonly required = element(by.css(`[data-automation-id="variable-required"]`));
    readonly updateButton = element(by.css(`[data-automation-id="update-button"]`));
    readonly closeButton = element(by.css(`[data-automation-id="close-button"]`));

    readonly calendar = new Calendar();

    async isLoaded(): Promise<boolean> {
        await BrowserVisibility.waitUntilElementIsVisible(this.variablesDialog);
        return true;
    }

    async isTitleIconDisplayed(): Promise<boolean> {
        await BrowserVisibility.waitUntilElementIsVisible(this.variablesDialogTitleIcon);
        return true;
    }

    async addVariable(): Promise<void> {
        await BrowserActions.click(this.add);
    }

    async deleteVariable(): Promise<void> {
        await BrowserActions.click(this.delete);
    }

    async setVariableName(name: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.name, name);
    }

    async setVariableType(type: string): Promise<void> {
        await BrowserActions.click(this.type);
        const varTypeOption = element(by.css(`[data-automation-id='variable-type-${type}']`));
        await BrowserActions.click(varTypeOption);
    }

    async setBooleanVariableValue(value: string): Promise<void> {
        await BrowserActions.click(this.value);
        const varValueOption = element(by.cssContainingText('.mat-option-text', value));
        await BrowserActions.click(varValueOption);
    }

    async setDateVariableValue(): Promise<void> {
        await BrowserActions.click(this.datePicker);
        await this.calendar.isDisplayed();
        await this.calendar.setToday();
    }

    async setVariableValue(value: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.value, value);
    }

    async setRequired(required: boolean = false) {
        if ( required ) {
            await BrowserActions.click(this.required);
        }
    }

    async setVariable(name: string = 'name', type: string = 'string', value: string  = '') {
        await this.setVariableName(name);
        await this.setVariableType(type);

        switch (type) {
            case 'boolean':
                await this.setBooleanVariableValue(value);
                break;

            case 'date':
                await this.setDateVariableValue();
                break;

            case 'file':
            case 'json':
                break;

            default:
                await this.setVariableValue(value);
        }
    }

    async getVariableValue(): Promise<string> {
        return this.value.getText();
    }

    async isFormVariableDisplayed(rowIndex: number, name: string = 'name', type: string = 'string', value: string = '', required?: string): Promise<boolean> {
        let valueCell;
        const variableRow = `[data-automation-id*="variable-row-${rowIndex}"]`;

        const nameCell = element(by.css(`${variableRow}>[data-automation-id="variable-name-cell-${name}"]`));
        await BrowserVisibility.waitUntilElementIsVisible(nameCell);

        const typeCell = element(by.css(`${variableRow}>[data-automation-id="variable-type-cell-${type}"]`));
        await BrowserVisibility.waitUntilElementIsVisible(typeCell);

        if (required !== null && typeof required !== 'undefined') {
            const requiredCell = element(by.css(`${variableRow}>[data-automation-id="variable-required-cell-${required}"]`));
            await BrowserVisibility.waitUntilElementIsVisible(requiredCell);
        }

        if (type !== 'string' && value === '') {
            valueCell = element(by.css(`${variableRow}>[data-automation-id="variable-value-cell-undefined"]`));
        } else {
            valueCell = element(by.css(`${variableRow}>[data-automation-id="variable-value-cell-${value}"]`));
        }
        await BrowserVisibility.waitUntilElementIsVisible(valueCell);

        return true;
    }

    async checkNoRowIsDisplayed(): Promise<void> {
        const row = element(by.css('.mat-row'));
        await BrowserVisibility.waitUntilElementIsNotVisible(row);
    }

    async isVariableDisplayed(rowIndex: number, name: string = 'name', type: string = 'string', value: string = '', required: string = 'false'): Promise<boolean> {
        return this.isFormVariableDisplayed(rowIndex, name, type, value, required);
    }

    async getVariableIdByRow(rowIndex: number): Promise<string> {
        const rowLocator = `variable-row-${rowIndex}`;
        const variableRow = element(by.css(`[data-automation-id*="${rowLocator}"]`));
        const attr = await variableRow.getAttribute('data-automation-id');

        return attr.substring(rowLocator.length + 1);
    }

    async update(): Promise<void> {
        await BrowserActions.click(this.updateButton);
    }

    async isUpdateButtonEnabled(): Promise<boolean> {
        return this.updateButton.isEnabled();
    }

    async isAddButtonEnabled(): Promise<boolean> {
        return this.add.isEnabled();
    }

    async waitValidationErrorDisplayed(errorMessage: string): Promise<boolean> {
        try {
            const validationError = element(by.cssContainingText('.mat-error', errorMessage));
            await BrowserVisibility.waitUntilElementIsVisible(validationError);
            return true;
        } catch {
            return false;
        }
    }
    async waitValidationErrorNotDisplayed(errorMessage: string): Promise<boolean> {
        try {
            const validationError = element(by.cssContainingText('.mat-error', errorMessage));
            await BrowserVisibility.waitUntilElementIsNotVisible(validationError);
            return true;
        } catch {
            return false;
        }
    }
    async isInvalidErrorInfoIconDisplayed(): Promise<boolean> {
        const infoIcon = element(by.css(`[data-automation-id="variable-name-info-icon"]`));
        return BrowserVisibility.waitUntilElementIsVisible(infoIcon);
    }
    async close(): Promise<void> {
        await BrowserActions.click(this.closeButton);
        await super.isDialogDismissed();
    }
}
