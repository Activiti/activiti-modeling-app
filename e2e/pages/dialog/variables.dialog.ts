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

export class VariablesDialog extends GenericDialog {

    readonly variablesDialog = element(by.css(`[data-automation-id="variables-dialog"]`));
    readonly variablesDialogTitleIcon = element(by.cssContainingText(`.mat-dialog-title mat-icon`, 'layers'));
    readonly add = element(by.css(`[data-automation-id="add-variable"]`));
    readonly delete = element(by.css(`[data-automation-id="delete-variable"]`));
    readonly name = element(by.css(`[data-automation-id="variable-name"]`));
    readonly type = element(by.css(`[data-automation-id="variable-type"]`));
    readonly value = element(by.css(`[data-automation-id="variable-value"]`));
    readonly required = element(by.css(`[data-automation-id="variable-required"]`));
    readonly nameCell = element(by.css(`[data-automation-id="variable-name-cell"]`));
    readonly typeCell = element(by.css(`[data-automation-id="variable-type-cell"]`));
    readonly valueCell = element(by.css(`[data-automation-id="variable-value-cell"]`));
    readonly requiredCell = element(by.css(`[data-automation-id="variable-required-cell"]`));
    readonly propertiesViewer = element(by.id(`mat-tab-label-0-0`));
    readonly codeEditor = element(by.id(`mat-tab-label-1-1`));
    readonly updateButton = element(by.css(`[data-automation-id="update-button"]`));
    readonly closeButton = element(by.css(`[data-automation-id="close-button"]`));

    async isLoaded() {
        await super.waitForElementToBeVisible(this.variablesDialog);
        return true;
    }

    async isTitleIconDisplayed() {
        await super.waitForElementToBeVisible(this.variablesDialogTitleIcon);
        return true;
    }

    async addVariable() {
        await super.click(this.add);
    }

    async isVariableDisplayed(rowIndex: number, name: string = 'name', type: string = 'string', value: string = '', required: string = 'false') {
        const variableRow = `[data-automation-id*="variable-row-${rowIndex}"]`;

        const nameCell = element(by.css(`${variableRow}>[data-automation-id="variable-name-cell-${name}"]`));
        await super.waitForElementToBeVisible(nameCell);

        const typeCell = element(by.css(`${variableRow}>[data-automation-id="variable-type-cell-${type}"]`));
        await super.waitForElementToBeVisible(typeCell);

        const requiredCell = element(by.css(`${variableRow}>[data-automation-id="variable-required-cell-${required}"]`));
        await super.waitForElementToBeVisible(requiredCell);

        const valueCell = element(by.css(`${variableRow}>[data-automation-id="variable-value-cell-${value}"]`));
        await super.waitForElementToBeVisible(valueCell);

        return true;
    }

    async goToPropertiesViewer() {
        await super.click(this.propertiesViewer);
    }

    async goTocodeEditor() {
        await super.click(this.codeEditor);
    }

    async getVariableIdByRow(rowIndex: number) {
        const rowLocator = `variable-row-${rowIndex}`;
        const variableRow = element(by.css(`[data-automation-id*="${rowLocator}"]`));
        const attr = await variableRow.getAttribute('data-automation-id');

        return attr.substring(rowLocator.length + 1);
    }

    async update() {
        await super.click(this.updateButton);
        await super.isDialogDisplayed();
    }

    async close() {
        await super.click(this.closeButton);
        await super.isDialogDismissed();
    }
}
