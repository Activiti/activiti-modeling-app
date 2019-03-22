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

import { element, by, ElementFinder, browser } from 'protractor';
import { GenericPage } from 'ama-testing/e2e';

export class ConnectorAdvancedEditor extends GenericPage {

    readonly connectorAdvancedEditor = element(by.css(`[data-automation-id="connector-advanced-tab"]`));
    readonly connectorNameInput = element(by.css(`[data-automation-id="connector-content-input-name"]`));
    readonly connectorDescriptionInput = element(by.css(`[data-automation-id="connector-content-input-desc"]`));
    readonly addActionButton = element(by.css(`[data-automation-id="connector-add-action-button"]`));
    readonly actionsPanel = element(by.css('.connector-actions-panel'));
    readonly actionInputCss = `[data-automation-id="connector-action-name-input"]`;
    readonly actionTextareaCss = `[data-automation-id="connector-action-description-textarea"]`;
    readonly actionNameInput = element(by.css(this.actionInputCss));
    readonly actionDescriptionTextarea = element(by.css(`[data-automation-id="connector-action-description-textarea"]`));
    readonly parameterInputCss = `[data-automation-id="parameters-item-name"]`;
    readonly parameterTextareaCss = `[data-automation-id="parameters-item-desc"]`;
    readonly parameterSelectCss = `[data-automation-id="parameters-item-type"]`;
    readonly parameterCheckboxCss = `[data-automation-id="parameters-item-required"]`;
    readonly parameterNameInput = `[data-automation-id="ITEM-parameters-form-name"]`;
    readonly parameterDescriptionInput = `[data-automation-id="ITEM-parameters-form-desc"]`;
    readonly parameterTypeDropdown = `[data-automation-id="ITEM-parameters-form-type"]`;
    readonly parameterRequiredCheckbox = `[data-automation-id="ITEM-parameters-form-required"] label`;
    readonly parameterAddButton = `[data-automation-id="ITEM-parameters-form-add-btn"]`;
    readonly parameterCard = `[data-automation-id="ITEM-new"]`;

    async isLoaded() {
        await super.waitForElementToBeVisible(this.connectorAdvancedEditor);
        return true;
    }

    async isUnloaded() {
        await super.waitForElementToBeInVisible(this.connectorAdvancedEditor);
        return true;
    }

    async setConnectorName(name: string) {
        await super.clear(this.connectorNameInput);
        await super.sendKeysIfVisible(this.connectorNameInput, name);
    }

    async setConnectorDescription(description: string) {
        await super.clear(this.connectorDescriptionInput);
        await super.sendKeysIfVisible(this.connectorDescriptionInput, description);
    }

    async setConnectorDetails(name: string, description: string) {
        await this.setConnectorName(name);
        await this.setConnectorDescription(description);
    }

    async getConnectorDetails() {
        await super.waitForElementToBeVisible(this.connectorNameInput);

        return {
            name: await this.connectorNameInput.getAttribute('value'),
            description: await this.connectorDescriptionInput.getAttribute('value')
        };
    }

    async getActionDetailsById(actionId: string) {
        const itemInput = element(by.css(`[data-automation-id*='${actionId}']+div ${this.actionInputCss}`));
        const itemTextarea = element(by.css(`[data-automation-id*='${actionId}']+div ${this.actionTextareaCss}`));

        return {
            name: await itemInput.getAttribute('value'),
            description: await itemTextarea.getAttribute('value')
        };
    }

    async getParameterDetailsById(paramId: string) {
        const paramInput = element(by.css(`[data-automation-id*='${paramId}'] ${this.parameterInputCss}`));
        const paramTextarea = element(by.css(`[data-automation-id*='${paramId}'] ${this.parameterTextareaCss}`));
        const paramSelect = element(by.css(`[data-automation-id*='${paramId}'] ${this.parameterSelectCss}`));
        const paramCheckbox = element(by.css(`[data-automation-id*='${paramId}'] ${this.parameterCheckboxCss} input`));

        return {
            name: await paramInput.getAttribute('value'),
            description: await paramTextarea.getAttribute('value'),
            type: await paramSelect.getAttribute('textContent'),
            required: JSON.parse(await paramCheckbox.getAttribute('checked'))
        };
    }

    async addAction(name: string, description: string) {
        await super.click(this.addActionButton);
        await super.click(this.actionsPanel);

        await super.clear(this.actionNameInput);
        await super.sendKeysIfVisible(this.actionNameInput, name);
        await super.sendKeysIfVisible(this.actionDescriptionTextarea, description);
    }

    async addParameter(name: string, description: string, type: string, itemType: string, required: boolean = false) {
        await this.addParameterName(name, itemType);
        await this.addParameterDescription(description, itemType);
        await this.addParameterType(type, itemType);
        if (required) {
            await this.checkParameterRequired(itemType);
        }

        const addBtn = this.getAddParameterBtn(itemType);

        await super.click(addBtn);
    }

    getAddParameterBtn(itemType: string): ElementFinder {
        return element(by.css(this.parameterAddButton.replace('ITEM', itemType)));
    }

    getParameterCard(itemType: string): ElementFinder {
        return element(by.css(this.parameterCard.replace('ITEM', itemType)));
    }

    async addParameterName(name: string, itemType: string) {
        browser.actions().mouseMove(this.getParameterCard(itemType)).perform();
        const inputName = element(by.css(this.parameterNameInput.replace('ITEM', itemType)));
        await super.clear(inputName);
        await super.sendKeysIfVisible(inputName, name);
    }

    async addParameterDescription(description: string, itemType: string) {
        const inputDesc = element(by.css(this.parameterDescriptionInput.replace('ITEM', itemType)));
        await super.sendKeysIfVisible(inputDesc, description);
    }

    async addParameterType(type: string, itemType: string) {
        const dropdownType = element(by.css(this.parameterTypeDropdown.replace('ITEM', itemType)));
        await super.click(dropdownType);

        await super.click(element(by.cssContainingText(`.mat-option-text`, type)));
    }

    async checkParameterRequired(itemType: string) {
        await element(by.css(this.parameterRequiredCheckbox.replace('ITEM', itemType))).click();
    }

    async getElementIdByName(name: string) {
        const item = element(by.css(`[data-automation-id*=${name}]`));
        browser.actions().mouseMove(item).perform();
        await super.waitForElementToBeVisible(item);
        const attribute = await item.getAttribute(`data-automation-id`);
        return attribute.substring(attribute.indexOf(name) + (name.length + 1));
    }

    async expandActionById(actionId: string) {
        const actionItem = element(by.css(`[data-automation-id*=${actionId}]`));
        await super.click(actionItem);
    }
}
