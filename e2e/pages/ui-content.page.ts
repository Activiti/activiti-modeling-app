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

export class UiContentPage extends GenericPage {

    readonly appUrl = `${testConfig.ama.url}${testConfig.ama.port !== '' ? `:${testConfig.ama.port}` : ''}`;
    readonly uiEditorContextMenu = element(by.css(`[data-automation-id="ui-editor-menu-button"]`));
    readonly uiEditorDeleteButton = element(by.css(`[data-automation-id="ui-editor-delete-button"]`));
    readonly uiEditorSaveButton = element(by.css(`[data-automation-id="ui-editor-save-button"]`));
    readonly uiEditorDownloadButton = element(by.css(`[data-automation-id="ui-editor-download-button"]`));
    readonly advancedEditorTabButton = element(by.css(`[id="mat-tab-label-0-0"]`));
    readonly codeEditorTabButton = element(by.css(`[id="mat-tab-label-0-1"]`));
    readonly uiEditorPage = element(by.css(`.ama-ui-editor`));

    constructor(public appId?: string, public uiId?: string) {
        super();
    }

    async isLoaded() {
        await super.waitForElementToBeVisible(this.uiEditorPage);
        return true;
    }

    async isUnloaded() {
        await super.waitForElementToBeInVisible(this.uiEditorPage);
        return true;
    }

    async navigateTo() {
        await super.navigateTo(`${this.appUrl}/projects/${this.appId}/ui/${this.uiId}`);
    }

    async selectAdvancedEditor() {
        await super.click(this.advancedEditorTabButton);
    }

    async selectCodeEditor() {
        await super.click(this.codeEditorTabButton);
    }

    async deleteUi() {
        await super.click(this.uiEditorContextMenu);
        await super.click(this.uiEditorDeleteButton);
    }

    async save() {
        await super.click(this.uiEditorSaveButton);
    }

    async downloadUi() {
        await super.click(this.uiEditorDownloadButton);
    }
}
