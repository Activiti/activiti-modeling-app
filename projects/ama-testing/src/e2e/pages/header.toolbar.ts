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

import { browser, element, by, protractor, ElementFinder } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';
import { GenericWebElement } from './common/generic.webelement';
import { TestConfig } from '../config';

export class HeaderToolbar extends GenericWebElement {

    appTitle: ElementFinder;
    readonly appIcon = element(by.css('.adf-app-logo'));
    readonly searchIcon = element(by.css('.adf-search-button'));
    readonly searchBarExpanded = element(by.css(`.adf-search-container[state='active']`));
    readonly searchBarCollapsed = element(by.css(`.adf-search-container[state='inactive']`));
    readonly searchTextInput = element(by.css('#adf-control-input'));
    readonly userAvatar = element(by.css('div.current-user__avatar'));
    readonly userMenu = element(by.css(`div.mat-menu-content`));
    readonly settings = element(by.cssContainingText(`button.mat-menu-item>span`, 'Settings'));

    constructor(private testConfig: TestConfig) {
        super();
        this.appTitle = element(by.cssContainingText('.adf-app-title', this.testConfig.ama.appTitle));
    }

    async isAppTitleDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.appTitle);
        await browser.refresh();
    }

    async clickOnAppIcon() {
        await BrowserActions.click(this.appIcon);
    }

    async clickOnUserAvatar() {
        await BrowserActions.click(this.userAvatar);
        await BrowserVisibility.waitUntilElementIsVisible(this.userMenu);
    }

    async goToSettings() {
        await BrowserActions.click(this.settings);
    }

    async toggleSearch() {
        await BrowserActions.click(this.searchIcon);
    }

    async writeSearchQuery(text: string): Promise<void> {
        await this.isSearchBarExpanded();
        await BrowserVisibility.waitUntilElementIsVisible(this.searchTextInput);
        await this.searchTextInput.clear();
        await this.searchTextInput.sendKeys(text);
        await this.searchTextInput.sendKeys(protractor.Key.ENTER);
    }

    async isSearchBarExpanded(): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(this.searchBarExpanded);
            return true;
        } catch {
            return false;
        }
    }

    async isSearchBarCollapsed(): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(this.searchBarCollapsed);
            return true;
        } catch { return false; }
    }
}
