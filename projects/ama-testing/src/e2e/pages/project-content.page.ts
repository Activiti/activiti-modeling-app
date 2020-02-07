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

import { element, by, browser, ElementFinder } from 'protractor';
import { GenericPage } from './common/generic.page';
import { TestConfig } from '../config';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class ProjectContentPage extends GenericPage {

    readonly textractConnectorIcon = `alfresco-oob-icon-textract`;
    readonly rekognitionConnectorIcon = `alfresco-oob-icon-rekognition`;
    readonly comprehendConnectorIcon = `alfresco-oob-icon-comprehend`;
    readonly lambdaConnectorIcon = `alfresco-oob-icon-lambda`;
    readonly twilioConnectorIcon = `alfresco-oob-icon-twilio`;
    readonly slackConnectorIcon = `alfresco-oob-icon-slack`;
    readonly salesforceConnectorIcon = `alfresco-oob-icon-salesforce`;
    readonly emailConnectorIcon = `alfresco-oob-icon-email`;
    readonly restConnectorIcon = `alfresco-oob-icon-rest`;
    readonly camelConnectorIcon = `alfresco-oob-icon-camel`;
    readonly dbpConnectorIcon = `alfresco-oob-icon-dbp`;
    readonly docusignConnectorIcon = `alfresco-oob-icon-docusign`;
    readonly docgenConnectorIcon = `alfresco-oob-icon-docgen`;

    constructor(testConfig: TestConfig, public projectId: string) {
        super(testConfig);
    }

    async navigateTo(skipRefresh?: boolean): Promise<void> {
        await BrowserActions.getUrl(`${browser.baseUrl}/#/projects/${this.projectId}`);
        if (!skipRefresh) {
            await browser.refresh();
        }
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

    async createScript(): Promise<void> {
        await this.createModel('script');
    }

    private async isItemInList(modelType: string, searchedItem: string): Promise<boolean> {
        const containerSelector = `[data-automation-id="project-filter-${modelType}-container"]`,
            model = element(by.cssContainingText(containerSelector, searchedItem));

        return BrowserVisibility.waitUntilElementIsVisible(model);
    }

    async getConnectorWithIcon(iconClass: string, connectorName: string): Promise<ElementFinder> {
        const containerSelector = `span.${iconClass}+span.project-tree-filter__name`;
        const connectorWithIcon = element(by.cssContainingText(containerSelector, connectorName));
        return connectorWithIcon;
    }

    async isConnectorWithIconInList(connectorWithIcon: ElementFinder): Promise<boolean> {
        try {
            return await BrowserVisibility.waitUntilElementIsVisible(connectorWithIcon);
        } catch (error) {
            return false;
        }
    }

    async isTextractConnectorDisplayed(connectorName: string): Promise<boolean> {
        const connector = await this.getConnectorWithIcon(this.textractConnectorIcon, connectorName);
        return this.isConnectorWithIconInList(connector);
    }

    async isRekognitionConnectorDisplayed(connectorName: string): Promise<boolean> {
        const connectorIcon = await this.getConnectorWithIcon(this.rekognitionConnectorIcon, connectorName);
        return this.isConnectorWithIconInList(connectorIcon);
    }

    async isComprehendConnectorDisplayed(connectorName: string): Promise<boolean> {
        const connectorIcon = await this.getConnectorWithIcon(this.comprehendConnectorIcon, connectorName);
        return this.isConnectorWithIconInList(connectorIcon);
    }

    async isLambdaConnectorDisplayed(connectorName: string): Promise<boolean> {
        const connectorIcon = await this.getConnectorWithIcon(this.lambdaConnectorIcon, connectorName);
        return this.isConnectorWithIconInList(connectorIcon);
    }

    async isTwilioConnectorDisplayed(connectorName: string): Promise<boolean> {
        const connectorIcon = await this.getConnectorWithIcon(this.twilioConnectorIcon, connectorName);
        return this.isConnectorWithIconInList(connectorIcon);
    }

    async isSlackConnectorDisplayed(connectorName: string): Promise<boolean> {
        const connectorIcon = await this.getConnectorWithIcon(this.slackConnectorIcon, connectorName);
        return this.isConnectorWithIconInList(connectorIcon);
    }

    async isSalesForceConnectorDisplayed(connectorName: string): Promise<boolean> {
        const connectorIcon = await this.getConnectorWithIcon(this.salesforceConnectorIcon, connectorName);
        return this.isConnectorWithIconInList(connectorIcon);
    }

    async isEmailConnectorDisplayed(connectorName: string): Promise<boolean> {
        const connectorIcon = await this.getConnectorWithIcon(this.emailConnectorIcon, connectorName);
        return this.isConnectorWithIconInList(connectorIcon);
    }

    async isRestConnectorDisplayed(connectorName: string): Promise<boolean> {
        const connectorIcon = await this.getConnectorWithIcon(this.restConnectorIcon, connectorName);
        return this.isConnectorWithIconInList(connectorIcon);
    }

    async isCamelConnectorDisplayed(connectorName: string): Promise<boolean> {
        const connectorIcon = await this.getConnectorWithIcon(this.camelConnectorIcon, connectorName);
        return this.isConnectorWithIconInList(connectorIcon);
    }

    async isDbpConnectorDisplayed(connectorName: string): Promise<boolean> {
        const connectorIcon = await this.getConnectorWithIcon(this.dbpConnectorIcon, connectorName);
        return this.isConnectorWithIconInList(connectorIcon);
    }

    /* cspell: disable-next-line */
    async isDocuSignConnectorDisplayed(connectorName: string): Promise<boolean> {
        const connectorIcon = await this.getConnectorWithIcon(this.docusignConnectorIcon, connectorName);
        return this.isConnectorWithIconInList(connectorIcon);
    }

    async isDocGenConnectorDisplayed(connectorName: string): Promise<boolean> {
        const connectorIcon = await this.getConnectorWithIcon(this.docgenConnectorIcon, connectorName);
        return this.isConnectorWithIconInList(connectorIcon);
    }
}
