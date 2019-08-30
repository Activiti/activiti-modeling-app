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

    readonly candidateUser = element(by.css('input[data-automation-id="card-textitem-editinput-candidateUsers"]'));
    readonly candidateUserSaveButton = element(by.css('[data-automation-id="card-textitem-update-candidateUsers"]'));
    readonly candidateUserEditButton = element(by.css('[data-automation-id="card-textitem-edit-icon-candidateUsers"]'));

    readonly candidateGroup = element(by.css('input[data-automation-id="card-textitem-editinput-candidateGroups"]'));
    readonly candidateGroupSaveButton = element(by.css('[data-automation-id="card-textitem-update-candidateGroups"]'));
    readonly candidateGroupEditButton = element(by.css('[data-automation-id="card-textitem-edit-icon-candidateGroups"]'));

    async setAssignee(assigneeName: string) {
        await super.click(this.assigneeEditButton);
        await super.sendKeysIfVisible(this.assignee, assigneeName);
        await super.click(this.assigneeSaveButton);
    }

    async setCandidateUser(candidateUserName: string) {
        await super.click(this.candidateUserEditButton);
        await super.sendKeysIfVisible(this.candidateUser, candidateUserName);
        await super.click(this.candidateUserSaveButton);
    }

    async setCandidateGroup(candidateGroupName: string) {
        await super.click(this.candidateGroupEditButton);
        await super.sendKeysIfVisible(this.candidateGroup, candidateGroupName);
        await super.click(this.candidateGroupSaveButton);
    }

    async errorMessageIsDisplayed(errorId: string) {
        const error = element(by.css(`[data-automation-id="${errorId}"]`));
        await super.waitForElementToBeVisible(error);
        return true;
    }

    async getMappingTypeValue(): Promise<string> {
        const selectorElement = element(by.css(`[data-automation-id="mapping-type"] .mat-select`));
        await super.waitForElementToBeVisible(selectorElement);
        return await selectorElement.getText();
    }

    async setMappingTypeValue(value: string) {
        const selectorElement = element(by.css(`[data-automation-id="mapping-type"] .mat-select`));
        await super.waitForElementToBeVisible(selectorElement);
        await super.click(selectorElement);

        const option = element(by.cssContainingText('.mat-option-text', value));
        await super.click(option);
    }

    async getSelectedFormName() {
        const selectedFormNameElement = element(by.css(`mat-select[data-automation-id="form-selector"] div span span`));
        await super.waitForElementToBeVisible(selectedFormNameElement);
        return await selectedFormNameElement.getText();
    }

}
