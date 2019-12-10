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

import { GenericWebElement } from './common/generic.webelement';
import { element, by } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class SidebarActionMenu extends GenericWebElement {

    readonly actionMenu = element(by.css(`div.adf-sidebar-action-menu`));
    readonly createButton = element(by.css(`button[data-automation-id='create-button']`));
    readonly menuOptions = element(by.css(`div.mat-menu-content`));
    readonly fileUploadInput = element(by.css(`input.app-import-project`));
    readonly uploadAppButton = element(by.css(`button.app-upload-btn`));
    readonly backDrop = element(by.css(`.cdk-overlay-container > .cdk-overlay-backdrop:first-child`));

    async isActionMenuDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.actionMenu);
    }

    async isOptionsMenuDismissed() {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.menuOptions);
    }

    async clickOnCreateButton() {
        await BrowserActions.click(this.createButton);
    }

    async clickOnBackdrop(): Promise<void> {
        await BrowserActions.click(this.backDrop);
    }

    async createItem(itemType: string) {
        const menuCreate = element(by.css('[data-automation-id="app-navigation-create"]'));
        await BrowserActions.click(menuCreate);

        const modelItem = element(by.css(`[data-automation-id="app-navigation-create-${itemType}"]`));
        await BrowserActions.click(modelItem);
    }

    async createProject() {
        await this.clickOnCreateButton();
        const project = element(by.cssContainingText(`.mat-menu-item>span`, 'Project'));
        await BrowserActions.click(project);
    }

    async uploadProject(filePath: string) {
        await super.sendKeysIfPresent(this.fileUploadInput, filePath);
        await this.clickOnBackdrop();
    }

    async createProcess() {
        await this.clickOnCreateButton();
        await this.createItem('process');
    }

    async createConnector() {
        await this.clickOnCreateButton();
        await this.createItem('connector');
    }

    async createForm() {
        await this.clickOnCreateButton();
        await this.createItem('form');
    }

    async createUi() {
        await this.clickOnCreateButton();
        await this.createItem('ui');
    }

    async createDecisionTable() {
        await this.clickOnCreateButton();
        await this.createItem('decision');
    }

    async createData() {
        await this.clickOnCreateButton();
        await this.createItem('data');
    }

    async createScript() {
        await this.clickOnCreateButton();
        await this.createItem('script');
    }

    async importItem(itemType: string, filePath: string) {
        const menuImport = element(by.css('[data-automation-id="app-navigation-upload"]'));
        await BrowserActions.click(menuImport);

        const modelInput = element(by.css(`[data-automation-id="app-navigation-upload-${itemType}"] input`));
        await super.sendKeysIfPresent(modelInput, filePath);
    }

    async importProcess(filePath: string) {
        await this.clickOnCreateButton();
        await this.importItem('process', filePath);
    }

    async importConnector(filePath: string) {
        await this.clickOnCreateButton();
        await this.importItem('connector', filePath);
    }

    async importForm(filePath: string) {
        await this.clickOnCreateButton();
        await this.importItem('form', filePath);
    }

    async importUi(filePath: string) {
        await this.clickOnCreateButton();
        await this.importItem('ui', filePath);
    }

    async importDecisionTable(filePath: string) {
        await this.clickOnCreateButton();
        await this.importItem('decision', filePath);
    }

    async importData(filePath: string) {
        await this.clickOnCreateButton();
        await this.importItem('data', filePath);
    }

    async importScript(filePath: string) {
        await this.clickOnCreateButton();
        await this.importItem('script', filePath);
    }
}
