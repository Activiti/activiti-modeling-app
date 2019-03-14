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

export class FormContentPage extends GenericPage {

    readonly appUrl = `${testConfig.ama.url}${testConfig.ama.port !== '' ? `:${testConfig.ama.port}` : ''}`;
    readonly formEditorContextMenu = element(by.css(`[data-automation-id="form-editor-menu-button"]`));
    readonly formEditorDeleteButton = element(by.css(`[data-automation-id="form-editor-delete-button"]`));
    readonly formEditorSaveButton = element(by.css(`[data-automation-id="form-editor-save-button"]`));
    readonly formEditorDownloadButton = element(by.css(`[data-automation-id="form-editor-download-button"]`));
    readonly advancedEditorTabButton = element(by.css(`[id="mat-tab-label-0-0"]`));
    readonly codeEditorTabButton = element(by.css(`[id="mat-tab-label-0-1"]`));
    readonly formEditorPage = element(by.css(`.ama-form-editor`));
    readonly dragAndDropArea = element(by.css(`.drop-row-placeholder`));

    constructor(public appId?: string, public formId?: string) {
        super();
    }

    async navigateTo() {
        await super.navigateTo(`${this.appUrl}/projects/${this.appId}/form/${this.formId}`);
    }

    async selectAdvancedEditor() {
        await super.click(this.advancedEditorTabButton);
    }

    async selectCodeEditor() {
        await super.click(this.codeEditorTabButton);
    }

    async isLoaded() {
        await super.waitForElementToBeVisible(this.formEditorPage);
        return true;
    }

    async isUnloaded() {
        await super.waitForElementToBeInVisible(this.formEditorPage);
        return true;
    }

    async deleteForm() {
        await super.click(this.formEditorContextMenu);
        await super.click(this.formEditorDeleteButton);
    }

    async save() {
        await super.click(this.formEditorSaveButton);
    }

    async downloadForm() {
        await super.click(this.formEditorDownloadButton);
    }

    async selectForm() {
        await super.click(this.dragAndDropArea);
    }
}
