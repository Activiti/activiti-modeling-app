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

export class Toolbar extends GenericWebElement {

    readonly home = element(by.css(`[data-automation-id='project-navigate-home']`));
    readonly downloadButton = element(by.css(`[data-automation-id='project-download-button']`));
    readonly validateButton = element(by.css(`[data-automation-id='project-validate-button']`));
    readonly breadcrumbCss = `[data-automation-id='breadcrumb']`;

    async isItemDisplayed(itemName: string): Promise<boolean> {
        const item = element(by.cssContainingText(`.ama-breadcrumb-item-current`, itemName));
        return BrowserVisibility.waitUntilElementIsVisible(item);
    }

    async goToHome(): Promise<void> {
        await BrowserActions.click(this.home);
    }

    async downloadFile(): Promise<void> {
        await BrowserActions.click(this.downloadButton);
    }

    async validateProject(): Promise<void> {
        await BrowserActions.click(this.validateButton);
    }

    async navigateToBreadcrumbItem(itemName: string): Promise<void> {
        const item = element(by.cssContainingText(`${this.breadcrumbCss}>div>a`, itemName));
        await BrowserActions.click(item);
    }

    async isElementInDirtyState(itemName: string): Promise<boolean> {
        const item = element(by.cssContainingText(`${this.breadcrumbCss}>[class='ama-breadcrumb-item active ng-star-inserted dirty']>div`, itemName));
        return BrowserVisibility.waitUntilElementIsVisible(item);
    }

    async isElementNotInDirtyState(itemName: string): Promise<boolean> {
        const item = element(by.cssContainingText(`${this.breadcrumbCss}>[class='ama-breadcrumb-item active ng-star-inserted']>div`, itemName));
        return BrowserVisibility.waitUntilElementIsVisible(item);
    }
}
