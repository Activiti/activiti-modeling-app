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

import { testConfig } from '../test.config';
import { element, by } from 'protractor';
import { GenericPage } from './common/generic.page';

export class DecisionTableContentPage extends GenericPage {

    readonly appUrl = `${testConfig.ama.url}${testConfig.ama.port !== '' ? `:${testConfig.ama.port}` : ''}`;
    readonly decisionTableEditorContextMenu = element(by.css(`[data-automation-id="decision-table-editor-menu-button"]`));
    readonly decisionTableEditorDeleteButton = element(by.css(`[data-automation-id="decision-table-editor-delete-button"]`));
    readonly decisionTableEditorSaveButton = element(by.css(`[data-automation-id="decision-table-editor-save-button"]`));
    readonly decisionTableEditorDownloadButton = element(by.css(`[data-automation-id="decision-table-editor-download-button"]`));
    readonly advancedEditorTabButton = element(by.css(`[id="mat-tab-label-0-0"]`));
    readonly codeEditorTabButton = element(by.css(`[id="mat-tab-label-0-1"]`));
    readonly decisionTableEditorPage = element(by.css(`.ama-decision-table-editor`));

    constructor(public appId?: string, public decisionTableId?: string) {
        super();
    }

    async isLoaded() {
        await super.waitForElementToBeVisible(this.decisionTableEditorPage);
        return true;
    }

    async isUnloaded() {
        await super.waitForElementToBeInVisible(this.decisionTableEditorPage);
        return true;
    }

    async navigateTo() {
        await super.navigateTo(`${this.appUrl}/projects/${this.appId}/decision/${this.decisionTableId}`);
    }

    async selectAdvancedEditor() {
        super.click(this.advancedEditorTabButton);
    }

    async selectCodeEditor() {
        super.click(this.codeEditorTabButton);
    }

    async deleteDecisionTable() {
        super.click(this.decisionTableEditorContextMenu);
        super.click(this.decisionTableEditorDeleteButton);
    }

    async save() {
        await super.click(this.decisionTableEditorSaveButton);
    }

    async downloadDecisionTable() {
        await super.click(this.decisionTableEditorDownloadButton);
    }
}
