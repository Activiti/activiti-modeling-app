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

export class DataContentPage extends GenericPage {

    readonly dataObjectEditorContextMenu = element(by.css(`[data-automation-id="data-object-editor-menu-button"]`));
    readonly dataObjectEditorDeleteButton = element(by.css(`[data-automation-id="data-object-editor-delete-button"]`));
    readonly dataObjectEditorSaveButton = element(by.css(`[data-automation-id="data-object-editor-save-button"]`));
    readonly dataObjectEditorDownloadButton = element(by.css(`[data-automation-id="data-object-editor-download-button"]`));
    readonly advancedEditorTabButton = element(by.css(`[id="mat-tab-label-0-0"]`));
    readonly codeEditorTabButton = element(by.css(`[id="mat-tab-label-0-1"]`));
    readonly dataObjectEditorPage = element(by.css(`.ama-datum-editor`));

    constructor(public appId?: string, public dataObjectId?: string) {
        super();
    }

    async isLoaded() {
        await super.waitForElementToBeVisible(this.dataObjectEditorPage);
        return true;
    }

    async isUnloaded() {
        await super.waitForElementToBeInVisible(this.dataObjectEditorPage);
        return true;
    }

    async navigateTo() {
        await super.navigateTo(`projects/${this.appId}/data/${this.dataObjectId}`);
    }

    async selectAdvancedEditor() {
        await super.click(this.advancedEditorTabButton);
    }

    async selectCodeEditor() {
        await super.click(this.codeEditorTabButton);
    }

    async deleteData() {
        await super.click(this.dataObjectEditorContextMenu);
        await super.click(this.dataObjectEditorDeleteButton);
    }

    async save() {
        await super.click(this.dataObjectEditorSaveButton);
    }

    async downloadData() {
        await super.click(this.dataObjectEditorDownloadButton);
    }
}
