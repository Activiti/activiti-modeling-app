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
import { GenericPage } from './common/generic.page';
import { TestConfig } from '../config';

export class ProcessContentPage extends GenericPage {

    readonly processEditorModeling = element(by.css(`[data-automation-id="process-editor-modeling"]`));
    readonly processEditorProperties = element(by.css(`[data-automation-id="process-editor-properties"]`));
    readonly processEditorContextMenu = element(by.css(`[data-automation-id="process-editor-menu-button"]`));
    readonly processEditorDeleteButton = element(by.css(`[data-automation-id="process-editor-delete-button"]`));
    readonly processEditorDownloadButton = element(by.css(`[data-automation-id="process-editor-download-button"]`));
    readonly processEditorSaveButton = element(by.css(`[data-automation-id="process-editor-save-button"]`));
    readonly extensionsEditorTabButton = element(by.css(`[id="mat-tab-label-0-2"]`));
    readonly codeEditorTabButton = element(by.css(`[id="mat-tab-label-0-1"]`));
    readonly modelerEditorTabButton = element(by.css(`[id="mat-tab-label-0-0"]`));

    constructor(testConfig: TestConfig, public appId?: string, public processId?: string) {
        super(testConfig);
    }

    async navigateTo() {
        await super.navigateTo(`projects/${this.appId}/process/${this.processId}`);
    }

    async isLoaded() {
        await super.waitForElementToBeVisible(this.processEditorModeling);
        return true;
    }

    async isUnloaded() {
        await super.waitForElementToBeInVisible(this.processEditorModeling);
        return true;
    }

    async deleteProcess() {
        await super.click(this.processEditorContextMenu);
        await super.click(this.processEditorDeleteButton);
    }

    async downloadProcess() {
        await super.click(this.processEditorDownloadButton);
    }

    async selectProcessEditorModeler() {
        await super.click(this.processEditorModeling);
    }

    async save() {
        await super.click(this.processEditorSaveButton);
    }

    async selectCodeEditor() {
        await super.click(this.codeEditorTabButton);
    }

    async selectExtensionsEditor() {
        await super.click(this.extensionsEditorTabButton);
    }

    async selectModelerEditorTab() {
        await super.click(this.modelerEditorTabButton);
    }

}
