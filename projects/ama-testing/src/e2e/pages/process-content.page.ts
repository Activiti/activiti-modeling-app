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
import { TestConfig } from '../config';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class ProcessContentPage extends GenericPage {

    readonly processEditorModeling = element(by.css(`[data-automation-id="process-editor-modeling"]`));
    readonly processEditorProperties = element(by.css(`[data-automation-id="process-editor-properties"]`));
    readonly processEditorContextMenu = element(by.css(`[data-automation-id="process-editor-menu-button"]`));
    readonly processEditorDeleteButton = element(by.css(`[data-automation-id="process-editor-delete-button"]`));
    readonly processEditorDownloadButton = element(by.css(`[data-automation-id="process-editor-download-button"]`));
    readonly processEditorSaveButton = element(by.css(`[data-automation-id="process-editor-save-button"]`));
    readonly extensionsEditorTabButton = element(by.cssContainingText('.mat-tab-label-content', 'Extensions editor'));
    readonly codeEditorTabButton = element(by.cssContainingText('.mat-tab-label-content', 'XML editor'));
    readonly modelerEditorTabButton = element(by.cssContainingText('.mat-tab-label-content', 'Diagram editor'));

    constructor(testConfig: TestConfig, public appId?: string, public processId?: string) {
        super(testConfig);
    }

    async navigateTo(): Promise<void> {
        await super.navigateTo(`projects/${this.appId}/process/${this.processId}`);
    }

    async isLoaded(): Promise<boolean> {
        await BrowserVisibility.waitUntilElementIsVisible(this.processEditorModeling);
        return true;
    }

    async isUnloaded(): Promise<boolean> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.processEditorModeling);
        return true;
    }

    async deleteProcess(): Promise<void> {
        await BrowserActions.click(this.processEditorContextMenu);
        await BrowserActions.click(this.processEditorDeleteButton);
    }

    async downloadProcess(): Promise<void> {
        await BrowserActions.click(this.processEditorDownloadButton);
    }

    async selectProcessEditorModeler(): Promise<void> {
        await BrowserActions.click(this.processEditorModeling);
    }

    async save(): Promise<void> {
        await BrowserActions.click(this.processEditorSaveButton);
    }

    async selectCodeEditor(): Promise<void> {
        await BrowserActions.click(this.codeEditorTabButton);
    }

    async selectExtensionsEditor(): Promise<void> {
        await BrowserActions.click(this.extensionsEditorTabButton);
    }

    async selectModelerEditorTab(): Promise<void> {
        await BrowserActions.click(this.modelerEditorTabButton);
        await browser.sleep(300);
    }

    async selectTask(taskId: string): Promise<void> {
        const taskElement = element(by.css(`[data-element-id="${taskId}"]`));
        await BrowserActions.click(taskElement);
    }

}
