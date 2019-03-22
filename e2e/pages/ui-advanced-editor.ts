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
import { GenericPage } from 'ama-testing/e2e';

export class UiAdvancedEditor extends GenericPage {

    readonly uiAdvancedEditor = element(by.css(`[data-automation-id="ui-advanced-tab"]`));
    readonly uiNameInput = element(by.css(`[data-automation-id="ui-content-input-name"]`));
    readonly uiDescriptionInput = element(by.css(`[data-automation-id="ui-content-input-desc"]`));
    readonly uiTemplateDropdown = element(by.css(`[data-automation-id="ui-content-template"]`));

    async isLoaded() {
        await super.waitForElementToBeVisible(this.uiAdvancedEditor);
        return true;
    }

    async isUnloaded() {
        await super.waitForElementToBeInVisible(this.uiAdvancedEditor);
        return true;
    }

    async setuiName(name: string) {
        await super.clear(this.uiNameInput);
        await super.sendKeysIfVisible(this.uiNameInput, name);
    }

    async setuiDescription(description: string) {
        await super.clear(this.uiDescriptionInput);
        await super.sendKeysIfVisible(this.uiDescriptionInput, description);
    }

    async setuiTemplate(template: string) {
        await super.click(this.uiTemplateDropdown);

        await super.click(element(by.cssContainingText(`.mat-option-text`, template)));
    }

    async setuiDetails(name: string, description: string, template: string) {
        await this.setuiName(name);
        await this.setuiDescription(description);
        await this.setuiTemplate(template);
    }

    async getuiDetails() {
        await super.waitForElementToBeVisible(this.uiNameInput);

        return {
            name: await this.uiNameInput.getAttribute('value'),
            description: await this.uiDescriptionInput.getAttribute('value'),
            'adf-template': await this.uiTemplateDropdown.getAttribute('value')
        };
    }
}
