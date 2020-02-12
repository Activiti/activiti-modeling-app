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
import { BrowserVisibility } from '@alfresco/adf-testing';

export class SnackBar extends GenericWebElement {
    async waitForMessage(message: string): Promise<boolean> {
        const snackbar = element.all(by.cssContainingText(`simple-snack-bar`, message)).first();
        try {
            await BrowserVisibility.waitUntilElementIsVisible(snackbar);
            return true;
        } catch {
            return false;
        }
    }

    async isCreatedSuccessfully(itemType: string): Promise<boolean> {
        return this.waitForMessage(
            `${this.firstUpperCase(itemType)} created`
        );
    }

    async isValidatedSuccessfully(itemType: string): Promise<boolean> {
        return this.waitForMessage(
            `${this.firstUpperCase(itemType)} is valid`
        );
    }

    async isValidatedUnsuccessfully(itemType: string): Promise<boolean> {
        return this.waitForMessage(
            `${this.firstUpperCase(itemType)} contains validation error(s)`
        );
    }

    async isUpdatedSuccessfully(itemType: string): Promise<boolean> {
        return this.waitForMessage(
            `${this.firstUpperCase(itemType)} saved`
        );
    }

    async isUploadedSuccessfully(itemType: string): Promise<boolean> {
        return this.waitForMessage(
            `${this.firstUpperCase(itemType)} uploaded`
        );
    }

    async isDeletedSuccessfully(itemType: string): Promise<boolean> {
        return this.waitForMessage(
            `${this.firstUpperCase(itemType)} deleted`
        );
    }

    async isReleasedSuccessfully(): Promise<boolean> {
        return this.waitForMessage(
            `Project released`
        );
    }

    async isProjectValidatedSuccessfully(): Promise<boolean> {
        return this.waitForMessage(
            `Project contains no validation errors`
        );
    }

    async isNotReleased(): Promise<boolean> {
        return this.waitForMessage(
            `We hit a problem releasing the project. Try releasing it again.`
        );
    }

    async isNameDuplicated(): Promise<boolean> {
        return this.waitForMessage(
            `with that name already exists`
        );
    }

    async isSnackBarNotDisplayed(): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsNotVisible(element.all(by.css(`simple-snack-bar`)).first());
            return true;
        } catch {
            return false;
        }
    }

    firstUpperCase(string): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}
