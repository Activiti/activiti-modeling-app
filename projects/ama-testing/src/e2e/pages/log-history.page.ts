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
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class LogHistoryPage extends GenericPage {

    static readonly FILTER = {
        projectEditor: 'Project Editor',
        processEditor: 'Process Editor',
        connectorEditor: 'Connector Editor',
        formEditor: 'Form Editor',
        uiEditor: 'UI Editor',
        decisionTableEditor: 'Decision Table Editor',
        all: 'All'
    };

    readonly messageIndicator = element(by.css(`.message-indicator`));
    readonly messageIndicatorInactive = element(by.css(`div[class='message-indicator inactive']`));
    readonly logIcon = element(by.css(`div[class='log-meta'] mat-icon`));
    readonly logInitiator = element.all(by.css(`div[class='log-meta'] span[class='log-initiator']`)).first();
    readonly logDateTime = element(by.css(`div[class='log-meta'] span[class='log-datetime']`));
    readonly logLevel = element.all(by.css(`div[class='log-meta'] span[class='log-level']`)).first();
    readonly logContent = element(by.css(`div[class='log-content'] div`));
    readonly logSection = element(by.css(`ama-log-history section`));
    readonly logEntry = element(by.css(`ama-log-history-entry`));
    readonly deleteIcon = element(by.css(`[data-automation-id='deleteLogs']`));
    readonly collapseArrow = element(by.css(`[data-automation-id='collapse']`));
    readonly filtersDropdown =  element(by.css(`.log-history-filters`));
    readonly filtersDropdownText = element.all(by.css('.mat-option-text'));
    readonly allLogContent = element.all(by.css(`div[class='log-content'] div`));

    constructor() {
        super();
    }

    async isLogSectionDisplayed() {
        try {
            return await BrowserVisibility.waitUntilElementIsVisible(this.logSection);
        } catch (error) {
            return false;
        }
    }

    async isLogSectionNotDisplayed() {
        try {
            return await BrowserVisibility.waitUntilElementIsNotVisible(this.logSection);
        } catch (error) {
            return false;
        }
    }

    async clickMessageIndicatorInactive() {
        await BrowserActions.click(this.messageIndicatorInactive);
    }

    async clickMessageIndicator() {
        await BrowserActions.click(this.messageIndicator);
        await BrowserVisibility.waitUntilElementIsVisible(this.logSection);
    }

    async getInitiator() {
        await BrowserVisibility.waitUntilElementIsVisible(this.logInitiator);
        return await this.logInitiator.getText();
    }

    async getDateTime() {
        return await this.logDateTime.getText();
    }

    async getLevel() {
        return await this.logLevel.getText();
    }

    async getMessage() {
        return await this.logContent.getText();
    }

    async isLogHistoryEmpty() {
        try {
            return await BrowserVisibility.waitUntilElementIsNotVisible(this.logEntry);
        } catch (error) {
            return false;
        }
    }

    async isLogHistoryNotEmpty() {
        try {
            return await BrowserVisibility.waitUntilElementIsVisible(this.logEntry);
        } catch (error) {
            return false;
        }
    }

    async deleteLogs() {
        await BrowserActions.click(this.deleteIcon);
    }

    async clickCollapseArrow() {
        return await BrowserActions.click(this.collapseArrow);
    }

    async selectFilter(filter: string) {
        await BrowserActions.click(this.filtersDropdown);
        const field = element(by.cssContainingText('.mat-option-text', filter));
        await BrowserActions.click(field);
    }

    async getFiltersValue() {
        await BrowserActions.click(this.filtersDropdown);
        return await this.filtersDropdownText.getText();
    }

    async getDefaultValue() {
        return await this.filtersDropdown.getText();
    }

    async getNumberOfMessages() {
        return await this.allLogContent.count();
    }

}
