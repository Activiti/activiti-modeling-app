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
import { browser } from 'protractor';
import { testConfig } from '../../test.config';

export class GenericPage extends GenericWebElement {

    url: string;

    async navigateTo(url: string) {
        return await browser.get(url);
    }

    async refreshPage() {
        await browser.refresh();
    }

    async isPageInDirtyState() {
        const pageTitle = await browser.getTitle();
        return pageTitle === `* ${testConfig.ama.appTitle}`;
    }

    async getModelId() {
        const url = await browser.getCurrentUrl();
        return url.substring(url.lastIndexOf('/') + 1);
    }
}
