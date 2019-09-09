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
import { BrowserVisibility } from '@alfresco/adf-testing';

export class Pagination extends GenericPage {

    readonly pageSize = element(by.css(`.mat-select`));
    readonly nextPage = element(by.css(`.mat-paginator-navigation-next`));

    async setItemsPerPage(itemsNo: number) {
        await super.click(this.pageSize);
        const itemsPerPage = element(by.cssContainingText('.mat-option-text', itemsNo.toString()));
        await super.click(itemsPerPage);
    }

    async set1000ItemsPerPage() {
        await this.setItemsPerPage(1000);
    }

    async isOnLastPage() {
        await BrowserVisibility.waitUntilElementIsPresent(this.nextPage);
        return await this.nextPage.getAttribute('disabled');
    }
}
