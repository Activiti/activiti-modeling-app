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

import { browser, ElementFinder, protractor } from 'protractor';
import { BrowserVisibility } from '@alfresco/adf-testing';

export class GenericWebElement {

    constructor() {
    }

    public async click(elem: ElementFinder) {
        try {
            await BrowserVisibility.waitUntilElementIsClickable(elem);
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
        await BrowserVisibility.waitUntilElementIsVisible(elem);
        await elem.sendKeys(text);
    }

    protected async sendKeysIfPresent(elem: ElementFinder, text: string) {
        await BrowserVisibility.waitUntilElementIsPresent(elem);
        await elem.sendKeys(text);
    }

    protected async dragAndDrop(elementToDrag: ElementFinder, locationToDragTo: ElementFinder, locationOffset = { x: 230, y: 280 }) {
        await this.click(elementToDrag);
        await browser.actions().mouseDown(elementToDrag).mouseMove(locationToDragTo, locationOffset).mouseUp().perform();
        await browser.actions().doubleClick(locationToDragTo).perform();
    }

    async dragAndDropNotClickableElement(elementToDrag: ElementFinder, locationToDragTo: ElementFinder) {
        await browser.actions().mouseMove(elementToDrag).perform();
        await browser.actions().mouseDown(elementToDrag).perform();
        await browser.actions().mouseMove({ x: 10, y: 100 }).perform();
        await browser.actions().mouseMove(locationToDragTo).perform();
        return browser.actions().mouseUp().perform();
    }

    protected async dropElement(locationToDragTo: ElementFinder) {
        await browser.actions().mouseDown(locationToDragTo).perform();
    }

}
