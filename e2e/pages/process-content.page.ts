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
import { testConfig } from '../test.config';

export class ProcessContentPage extends GenericPage {

    readonly appUrl = `${testConfig.ama.url}${testConfig.ama.port !== '' ? `:${testConfig.ama.port}` : ''}`;
    readonly processEditorModeling = element(by.css(`[data-automation-id="process-editor-modeling"]`));
    readonly processEditorProperties = element(by.css(`[data-automation-id="process-editor-properties"]`));
    readonly processEditorContextMenu = element(by.css(`[data-automation-id="process-editor-menu-button"]`));
    readonly processEditorDeleteButton = element(by.css(`[data-automation-id="process-editor-delete-button"]`));
    readonly processEditorDownloadButton = element(by.css(`[data-automation-id="process-editor-download-button"]`));
    readonly processEditorSaveButton = element(by.css(`[data-automation-id="process-editor-save-button"]`));

    constructor(public appId?: string, public processId?: string) {
        super();
    }

    async navigateTo() {
        await super.navigateTo(`${this.appUrl}/projects/${this.appId}/process/${this.processId}`);
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
}
