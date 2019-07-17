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

export class TaskPropertiesCardPage extends GenericPage {

    readonly assignee = element(by.css('input[data-automation-id="card-textitem-editinput-assignee"]'));
    readonly assigneeSaveButton = element(by.css('[data-automation-id="card-textitem-update-assignee"]'));
    readonly assigneeEditButton = element(by.css('[data-automation-id="card-textitem-edit-icon-assignee"]'));

    async setAssignee(assigneeName: string) {
        await super.click(this.assigneeEditButton);
        await super.sendKeysIfVisible(this.assignee, assigneeName);
        await super.click(this.assigneeSaveButton);
    }

}
