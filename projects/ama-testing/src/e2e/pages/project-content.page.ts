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
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class ProjectContentPage extends GenericPage {

    readonly itemsListExpanded = element(by.css(`div.mat-expanded`));

    constructor(testConfig: TestConfig, public projectId: string) {
        super(testConfig);
    }

    async navigateTo(): Promise<void> {
        await super.navigateTo(`projects/${this.projectId}`);
    }

    async isModelInList(modelType: string, modelName: string): Promise<boolean> {
        return this.isItemInList(modelType, modelName);
    }

    async isModelNotInList(modelType: string, modelId: string): Promise<boolean> {
        const modelRow = element(by.css(`[data-automation-id="${modelType}-${modelId}"]`));
        return BrowserVisibility.waitUntilElementIsNotVisible(modelRow);
    }

    async clickOnModel(modelType: string, modelId: string): Promise<void> {
        const modelRow = element(by.css(`[data-automation-id="${modelType}-${modelId}"]`));
        await BrowserActions.click(modelRow);
    }

    async clickOnModelByName(modelType: string, modelName: string) {
        const containerSelector = `[data-automation-id="project-filter-${modelType}-container"] a`,
            model = element(by.cssContainingText(containerSelector, modelName));
        await BrowserActions.click(model);
    }

    async openFilter(modelType: string): Promise<void> {
        const filterCss = `[data-automation-id="project-filter-${modelType}"]`;
        const spinner = element(by.css(`${filterCss} mat-spinner`));
        await BrowserVisibility.waitUntilElementIsNotVisible(spinner);
        await BrowserActions.click(element(by.css(filterCss)));
    }

    async importModel(modelType: string, filePath: string): Promise<void> {
        const importModelInput = element(by.css(`[data-automation-id="upload-${modelType}"] input`));
        await super.sendKeysIfPresent(importModelInput, filePath);
    }

    async createModel(modelType: string): Promise<void> {
        const addButton = element(by.css(`[data-automation-id="project-filter-${modelType}"] button`));
        await BrowserActions.click(addButton);
    }

    async createProcess(): Promise<void> {
        await this.createModel('process');
    }

    async createConnector(): Promise<void> {
        await this.createModel('connector');
    }

    async createForm(): Promise<void> {
        await this.createModel('form');
    }

    async createData(): Promise<void> {
        await this.createModel('data');
    }

    async createDecisionTable(): Promise<void> {
        await this.createModel('decision');
    }

    async createUI(): Promise<void> {
        await this.createModel('ui');
    }

    private async isItemInList(modelType: string, searchedItem: string): Promise<boolean> {
        const containerSelector = `[data-automation-id="project-filter-${modelType}-container"]`,
            model = element(by.cssContainingText(containerSelector, searchedItem));

        return BrowserVisibility.waitUntilElementIsVisible(model);
    }
}
