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

import { element, by, browser } from 'protractor';
import { GenericPage } from './common/generic.page';
import { testConfig } from '../test.config';

export class ConnectorContentPage extends GenericPage {

    readonly appUrl = `${testConfig.ama.url}${testConfig.ama.port !== '' ? `:${testConfig.ama.port}` : ''}`;
    readonly connectorEditorModeling = element(by.css(`[data-automation-id="connector-editor-modeling"]`));
    readonly connectorEditorContextMenu = element(by.css(`[data-automation-id="connector-editor-menu-button"]`));
    readonly connectorEditorDeleteButton = element(by.css(`[data-automation-id="connector-editor-delete-button"]`));
    readonly connectorEditorSaveButton = element(by.css(`[data-automation-id="connector-editor-save-button"]`));
    readonly connectorEditorDownloadButton = element(by.css(`[data-automation-id="connector-editor-download-button"]`));
    readonly codeEditorTabButton = element.all(by.css(`div.mat-tab-label`)).get(1);

    constructor(public appId?: string, public connectorId?: string) {
        super();
    }

    async navigateTo() {
        await super.navigateTo(`${this.appUrl}/projects/${this.appId}/connector/${this.connectorId}`);
    }

    async isLoaded() {
        await super.waitForElementToBeVisible(this.connectorEditorModeling);
        return true;
    }

    async isUnloaded() {
        await super.waitForElementToBeInVisible(this.connectorEditorModeling);
        return true;
    }

    async deleteConnector() {
        await super.click(this.connectorEditorContextMenu);
        await super.click(this.connectorEditorDeleteButton);
    }

    async selectCodeEditor() {
        await super.click(this.codeEditorTabButton);
    }

    async save() {
        browser.actions().mouseMove(this.connectorEditorSaveButton).perform();
        await super.click(this.connectorEditorSaveButton);
    }

    async download() {
        await super.click(this.connectorEditorDownloadButton);
    }
}
