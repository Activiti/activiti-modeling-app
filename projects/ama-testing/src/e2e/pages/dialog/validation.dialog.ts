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

export class ValidationDialog extends GenericDialog {

    readonly titleElement = element(by.css(`.mat-dialog-title`));
    readonly confirmButton = element(by.css(`[data-automation-id="dialog-confirm"]`));
    readonly closeButton = element(by.css(`[data-automation-id="dialog-close"]`));
    readonly validationDialog = element(by.css(`.cdk-overlay-pane`));
    readonly validationError = element.all(by.css(`.mat-dialog-content ul>li`)).first();


    constructor(title?: string) {
        super(title ? title : 'Are you sure you want to save this process?');
    }

    async isTitleDisplayed(): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(this.titleElement);
        } catch (error) {
            return false;
        }
        return ((await this.titleElement.getText()) === this.title);
    }

    async isDialogDismissed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.validationDialog);
    }

    async confirm(): Promise<void> {
        await BrowserActions.click(this.confirmButton);
    }

    async reject(): Promise<void> {
        await BrowserActions.click(this.closeButton);
    }

    async getErrorMessage(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.validationError);
        return this.validationError.getText();
    }
}
