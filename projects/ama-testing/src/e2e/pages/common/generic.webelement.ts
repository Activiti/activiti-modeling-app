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

import { browser, ElementFinder, ExpectedConditions, protractor } from 'protractor';
import { Logger } from '../../util/logger';

export class GenericWebElement {

    constructor(private readonly TIMEOUT_MS: number = 20000 ) {}

    public async click(elem: ElementFinder) {
        try {
            await this.waitForElementToBeClickable(elem);
            await elem.click();
        } catch (clickErr) {
            try {
                await browser.executeScript('arguments[0].scrollIntoView();', elem);
                await browser.executeScript('arguments[0].click();', elem);
            } catch (jsErr) {
                throw jsErr;
            }
        }
    }

    public async clear(elem: ElementFinder) {
        return new Promise(async (resolve) => {
            setTimeout(async () => {
                const fieldValue: any = await browser.executeScript(`return arguments[0].value;`, elem);
                for (let i = fieldValue.length; i > 0; i--) {
                    await elem.sendKeys(protractor.Key.BACK_SPACE);
                }
                resolve();
            }, 1000);
        });
    }

    protected async sendKeysIfVisible(elem: ElementFinder, text: string) {
        await this.waitForElementToBeVisible(elem);
        await elem.sendKeys(text);
    }

    protected async sendKeysIfPresent(elem: ElementFinder, text: string) {
        await this.waitForElementToBePresent(elem);
        await elem.sendKeys(text);
    }

    protected async waitForElementToBeClickable(elem: ElementFinder, maxWaitTimeInMs = this.TIMEOUT_MS) {
        try {
            await browser.wait(ExpectedConditions.elementToBeClickable(elem), maxWaitTimeInMs);
        } catch (error) {
            const elementLocator = elem.locator();
            Logger.error(`Element '${elementLocator}' is not clickable. \n`, error);
            throw error;
        }
    }

    protected async waitForElementToBeVisible(elem: ElementFinder, maxWaitTimeInMs = this.TIMEOUT_MS) {
        try {
            return await browser.wait(ExpectedConditions.visibilityOf(elem), maxWaitTimeInMs);
        } catch (error) {
            const elementLocator = elem.locator();
            Logger.error(`Element '${elementLocator}' is not visible. \n`, error);
            throw error;
        }
    }

    protected async waitForElementToBeInVisible(elem: ElementFinder, maxWaitTimeInMs = this.TIMEOUT_MS) {
        try {
            return await browser.wait(ExpectedConditions.invisibilityOf(elem), maxWaitTimeInMs);
        } catch (error) {
            const elementLocator = elem.locator();
            Logger.error(`Element '${elementLocator}' is still visible. \n`, error);
            throw error;
        }
    }
    protected async waitForElementToBePresent(elem: ElementFinder, maxWaitTimeInMs = this.TIMEOUT_MS) {
        try {
            return await browser.wait(ExpectedConditions.presenceOf(elem), maxWaitTimeInMs);
        } catch (error) {
            const elementLocator = elem.locator();
            Logger.error(`Element '${elementLocator}' is not present. \n`, error);
            throw error;
        }
    }

    protected async waitTextToBePresentInElement(elem: ElementFinder, text: string, maxWaitTimeInMs = this.TIMEOUT_MS) {
        try {
            return await browser.wait(ExpectedConditions.textToBePresentInElement(elem, text), maxWaitTimeInMs);
        } catch (error) {
            const elementLocator = elem.locator();
            Logger.error(`Text '${text}' is not present in Element '${elementLocator}'. \n`, error);
            throw error;
        }
    }

    protected async dragAndDrop(elementToDrag: ElementFinder, locationToDragTo: ElementFinder) {
        await this.click(elementToDrag);
        await browser.actions().
            mouseDown(elementToDrag).
            mouseMove(locationToDragTo, {x: 230, y: 280}).
            mouseUp().perform();
        await browser.actions().doubleClick(locationToDragTo).perform();
    }

    protected async dropElement(locationToDragTo: ElementFinder) {
        await browser.actions().
            mouseDown(locationToDragTo).
            perform();
    }
}
