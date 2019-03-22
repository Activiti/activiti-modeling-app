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

export class FormPropertiesCard extends GenericPage {

    readonly editorProperties = element(by.css(`.form-field-editor`));
    readonly editVariablesIcon = element(by.cssContainingText('[data-automation-id="edit-form-variables"] mat-icon', 'layers'));
    readonly editVariables = element(by.css(`[data-automation-id="edit-form-variables"]`));

    async isLoaded() {
        await super.waitForElementToBeVisible(this.editorProperties);
        return true;
    }

    async isEditVariablesButtonIconDisplayed() {
        await super.waitForElementToBeVisible(this.editVariablesIcon);
        return true;
    }

    async editFormVariables() {
        await super.click(this.editVariables);
    }
}
