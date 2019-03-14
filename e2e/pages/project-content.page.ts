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

export class ProjectContentPage extends GenericPage {

    readonly projectPageURL = `${testConfig.ama.url}${testConfig.ama.port !== '' ? `:${testConfig.ama.port}` : ''}/projects/`;
    readonly itemsListExpanded = element(by.css(`div.mat-expanded`));

    constructor(public projectId: string) {
        super();
    }

    async navigateTo() {
        await super.navigateTo(`${this.projectPageURL}${this.projectId}`);
    }

    async isModelInList(modelType: string, modelName: string) {
        return await this.isItemInList(modelType, modelName);
    }

    async isModelNotInList(modelType: string, modelId: string) {
        const modelRow = element(by.css(`[data-automation-id="${modelType}-${modelId}"]`));
        return await super.waitForElementToBeInVisible(modelRow);
    }

    async clickOnModel(modelType: string, modelId: string) {
        const modelRow = element(by.css(`[data-automation-id="${modelType}-${modelId}"]`));
        await super.click(modelRow);
    }

    async clickOnModelByName(modelType: string, modelName: string) {
        const containerSelector = `[data-automation-id="project-filter-${modelType}-container"] a`,
        model = element(by.cssContainingText(containerSelector, modelName));
        await super.click(model);
    }

    async openFilter(modelType: string) {
        const filterCss = `[data-automation-id="project-filter-${modelType}"]`;
        const spinner = element(by.css(`${filterCss} mat-spinner`));
        await super.waitForElementToBeInVisible(spinner);
        await super.click(element(by.css(filterCss)));
    }

    async importModel(modelType: string, filePath: string) {
        const importModelInput = element(by.css(`[data-automation-id="upload-${modelType}"] input`));
        await super.sendKeysIfPresent(importModelInput, filePath);
    }

    async createModel(modelType: string) {
        const addButton = element(by.css(`[data-automation-id="project-filter-${modelType}"] button`));
        await super.click(addButton);
    }

    async createProcess() {
        await this.createModel('process');
    }

    async createConnector() {
        await this.createModel('connector');
    }

    async createForm() {
        await this.createModel('form');
    }

    async createData() {
        await this.createModel('data');
    }

    async createDecisionTable() {
        await this.createModel('decision');
    }

    async createUI() {
        await this.createModel('ui');
    }

    private async isItemInList(modelType: string, searchedItem: string) {
        const containerSelector = `[data-automation-id="project-filter-${modelType}-container"]`,
        model = element(by.cssContainingText(containerSelector, searchedItem));

        return await super.waitForElementToBeVisible(model);
    }
}
