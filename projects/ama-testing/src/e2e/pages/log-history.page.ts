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
    readonly filtersDropdown = element(by.css(`.log-history-filters`));
    readonly filtersDropdownText = element.all(by.css('.mat-option-text'));
    readonly allLogContent = element.all(by.css(`div[class='log-content'] div`));

    constructor() {
        super();
    }

    async isLogSectionDisplayed(): Promise<boolean> {
        try {
            return BrowserVisibility.waitUntilElementIsVisible(this.logSection);
        } catch (error) {
            return false;
        }
    }

    async isLogSectionNotDisplayed(): Promise<boolean> {
        try {
            return BrowserVisibility.waitUntilElementIsNotVisible(this.logSection);
        } catch (error) {
            return false;
        }
    }

    async clickMessageIndicatorInactive(): Promise<void> {
        await BrowserActions.click(this.messageIndicatorInactive);
    }

    async clickMessageIndicator(): Promise<void> {
        await BrowserActions.click(this.messageIndicator);
        await BrowserVisibility.waitUntilElementIsVisible(this.logSection);
    }

    async getInitiator(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.logInitiator);
        return this.logInitiator.getText();
    }

    async getDateTime(): Promise<string> {
        return this.logDateTime.getText();
    }

    async getLevel(): Promise<string> {
        return this.logLevel.getText();
    }

    async getMessage(): Promise<string> {
        return this.logContent.getText();
    }

    async isLogHistoryEmpty(): Promise<boolean> {
        try {
            return BrowserVisibility.waitUntilElementIsNotVisible(this.logEntry);
        } catch (error) {
            return false;
        }
    }

    async isLogHistoryNotEmpty(): Promise<boolean> {
        try {
            return BrowserVisibility.waitUntilElementIsVisible(this.logEntry);
        } catch (error) {
            return false;
        }
    }

    async deleteLogs(): Promise<void> {
        await BrowserActions.click(this.deleteIcon);
    }

    async clickCollapseArrow(): Promise<void> {
        return BrowserActions.click(this.collapseArrow);
    }

    async selectFilter(filter: string): Promise<void> {
        await BrowserActions.click(this.filtersDropdown);
        const field = element(by.cssContainingText('.mat-option-text', filter));
        await BrowserActions.click(field);
    }

    async getFiltersValue(): Promise<string> {
        await BrowserActions.click(this.filtersDropdown);
        return this.filtersDropdownText.getText();
    }

    async getDefaultValue(): Promise<string> {
        return this.filtersDropdown.getText();
    }

    async getNumberOfMessages(): Promise<number> {
        return this.allLogContent.count();
    }

}
