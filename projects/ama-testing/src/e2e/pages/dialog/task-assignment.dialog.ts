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
import { GenericDialog } from '../common/generic.dialog';
import { BrowserActions, BrowserVisibility } from '@alfresco/adf-testing';

export class TaskAssignmentDialog extends GenericDialog {

    readonly assignmentDialog = element(by.css(`[data-automation-id="assignment-dialog"]`));
    readonly assignmentDialogTitle = element(by.css(`.mat-dialog-title`));
    readonly select = element(by.css(`.ama-assignment-selector`));
    readonly singleUserOption = element(by.css(`[data-automation-id="ama-assignment-option-assignee"]`));
    readonly candidatesOption = element(by.css(`[data-automation-id="ama-assignment-option-candidates"]`));
    readonly assigneeInput = element(by.css(`input[data-automation-id="ama-assignment-static-single-user-input"]`));
    readonly candidateUsersInput = element(by.css(`input[data-automation-id="ama-assignment-static-candidate-users-input"]`));
    readonly candidateGroupsInput = element(by.css(`input[data-automation-id="ama-assignment-static-candidate-groups-input"]`));
    readonly assignButton = element(by.css(`#ama-assign-button`));
    readonly closeButton = element(by.css(`#ama-close-button`));

    constructor() {
        super('Task Assignment');
    }

    async isLoaded(): Promise<boolean> {
        await BrowserVisibility.waitUntilElementIsVisible(this.assignmentDialog);
        return true;
    }

    async isTitleDisplayed(): Promise<boolean> {
        await BrowserVisibility.waitUntilElementIsVisible(this.assignmentDialogTitle);
        return true;
    }

    async setAssignee(assigneeName: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.assigneeInput, assigneeName);
    }

    async setCandidateUsers(candidateUsers: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.candidateUsersInput, candidateUsers);
    }

    async setCandidateGroups(candidateGroups: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.candidateGroupsInput, candidateGroups);
    }

    async selectAssignToSingleUserOption(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.select);
        await BrowserActions.click(this.select);
        await BrowserVisibility.waitUntilElementIsVisible(this.singleUserOption);
        await BrowserActions.click(this.singleUserOption);
    }

    async selectAssignToCandidatesOption(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.select);
        await BrowserActions.click(this.select);
        await BrowserVisibility.waitUntilElementIsVisible(this.candidatesOption);
        await BrowserActions.click(this.candidatesOption);
    }

    async assign(): Promise<void> {
        await BrowserActions.click(this.assignButton);
    }

    async isAssignButtonEnabled(): Promise<boolean> {
        return this.assignButton.isEnabled();
    }

    async close(): Promise<void> {
        await BrowserActions.click(this.closeButton);
        await super.isDialogDismissed();
    }
}
