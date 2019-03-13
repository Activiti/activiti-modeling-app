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

export class SnackBar extends GenericWebElement {

    readonly createItemMessage = `The ITEM was successfully created`;
    readonly updateItemMessage = `The ITEM was successfully updated`;
    readonly uploadItemMessage = `The ITEM was successfully uploaded`;
    readonly deleteItemMessage = `The ITEM was successfully deleted`;

    async isOperationSuccessful(operationMessage: string, itemType: string) {
        const itemCreated = element(by.cssContainingText(`simple-snack-bar>span`, operationMessage.replace('ITEM', itemType)));
        return await super.waitForElementToBeVisible(itemCreated);
    }

    async isCreatedSuccessfully(itemType: string) {
        return await this.isOperationSuccessful(this.createItemMessage, itemType);
    }

    async isUpdatedSuccessfully(itemType: string) {
        return await this.isOperationSuccessful(this.updateItemMessage, itemType);
    }

    async isUploadedSuccessfully(itemType: string) {
        return await this.isOperationSuccessful(this.uploadItemMessage, itemType);
    }

    async isDeletedSuccessfully(itemType: string) {
        return await this.isOperationSuccessful(this.deleteItemMessage, itemType);
    }
}
