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

import { GenericWebElement } from './generic.webelement';
import { element, by } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class GenericDialog extends GenericWebElement {

    readonly dialog = element.all(by.css(`.mat-dialog-container`)).first();
    readonly titleElement = element(by.css(`.mat-dialog-title`));
    readonly cancelButton = element(by.css(`[data-automation-id="dialog-close"]`));

    title: string;

    constructor(title: string) {
        super();
        this.title = title;
    }

    async isDialogDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.dialog);
    }

    async isDialogDismissed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.dialog);
    }

    async isTitleDisplayed(itemType?: string): Promise<boolean> {
        await BrowserVisibility.waitUntilElementIsVisible(this.titleElement);
        return ((await this.titleElement.getText()) === this.title.replace('ITEM', itemType));
    }

    async cancel(): Promise<void> {
        await BrowserActions.click(this.cancelButton);
    }
}
