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

import { GenericDialog } from '../common/generic.dialog';
import { element, by } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class ConfirmationDialog extends GenericDialog {

    readonly titleElement = element(by.css(`.mat-dialog-title`));
    readonly confirmButton = element(by.css(`[data-automation-id="dialog-confirm"]`));
    readonly closeButton = element(by.css(`[data-automation-id="dialog-close"]`));
    readonly subTitle = element(by.css(`mat-dialog-content p`));
    readonly messageCount = element.all(by.css('mat-dialog-content ul li'));

    title: string;

    constructor(title?: string) {
        super('Are you sure?');
        this.title = title;
    }

    async isTitleDisplayed(itemType): Promise<boolean> {
        await BrowserVisibility.waitUntilElementIsVisible(this.titleElement);
        return (await this.titleElement.getText()) === this.title.replace('ITEM', itemType);
    }

    async getSubTitleText(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.subTitle);
        return this.subTitle.getText();
    }

    async getMessageText(messageIndex: number): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.titleElement);
        return element(by.xpath(`//mat-dialog-content/ul/li[${messageIndex}]`)).getText();
    }

    async getTotalMessageCount(): Promise<number> {
        await BrowserVisibility.waitUntilElementIsVisible(this.titleElement);
        return this.messageCount.count();
    }

    async confirm(): Promise<void> {
        await BrowserActions.click(this.confirmButton);
    }

    async reject(): Promise<void> {
        await BrowserActions.click(this.closeButton);
    }

    async checkDialogAndConfirm(itemType): Promise<void> {
        await this.isDialogDisplayed();
        await this.isTitleDisplayed(itemType);
        await this.confirm();
        await this.isDialogDismissed();
    }

    async checkDialogAndReject(itemType): Promise<void> {
        await this.isTitleDisplayed(itemType);
        await this.reject();
        await this.isDialogDismissed();
    }
}
