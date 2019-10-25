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
import { TestConfig } from '../config/test.config.interface';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class ConnectorContentPage extends GenericPage {

    readonly connectorEditorModeling = element(by.css(`[data-automation-id="connector-editor-modeling"]`));
    readonly connectorEditorContextMenu = element(by.css(`[data-automation-id="connector-editor-menu-button"]`));
    readonly connectorEditorDeleteButton = element(by.css(`[data-automation-id="connector-editor-delete-button"]`));
    readonly connectorEditorSaveButton = element(by.css(`[data-automation-id="connector-editor-save-button"]`));
    readonly disabledSaveButton = element(by.css(`[data-automation-id="connector-editor-save-button"]:disabled`));
    readonly connectorEditorDownloadButton = element(by.css(`[data-automation-id="connector-editor-download-button"]`));
    readonly codeEditorTabButton = element.all(by.css(`div.mat-tab-label`)).get(1);

    constructor(public testConfig: TestConfig, public appId?: string, public connectorId?: string) {
        super(testConfig);
    }

    async navigateTo(): Promise<void> {
        await super.navigateTo(`projects/${this.appId}/connector/${this.connectorId}`);
    }

    async isLoaded(): Promise<boolean> {
        await BrowserVisibility.waitUntilElementIsVisible(this.connectorEditorModeling);
        return true;
    }

    async isUnloaded(): Promise<boolean> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.connectorEditorModeling);
        return true;
    }

    async deleteConnector(): Promise<void> {
        await BrowserActions.click(this.connectorEditorContextMenu);
        await BrowserActions.click(this.connectorEditorDeleteButton);
    }

    async selectCodeEditor(): Promise<void> {
        await BrowserActions.click(this.codeEditorTabButton);
    }

    async save(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.disabledSaveButton);
        browser.actions().mouseMove(this.connectorEditorSaveButton).perform();
        await BrowserActions.click(this.connectorEditorSaveButton);
    }

    async saveConnector(): Promise<void> {
        await BrowserActions.click(this.connectorEditorSaveButton);
    }

    async download(): Promise<void> {
        await BrowserActions.click(this.connectorEditorDownloadButton);
    }
}
