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
import { BrowserActions, BrowserVisibility } from '@alfresco/adf-testing';

export class CollaboratorsDialog extends GenericDialog {

    readonly titleElement = element(by.css(`.mat-dialog-title`));
    readonly closeButton = element(by.css(`[data-automation-id="dialog-close"]`));
    readonly collaborators = element.all(by.css('.collaborators-list .mat-column-username span'));
    readonly peopleCloudSearch = element(by.css(`input[data-automation-id='adf-people-cloud-search-input']`));
    readonly assigneeField = element(by.css(`input[data-automation-id='adf-people-cloud-search-input']`));
    readonly addButton = element(by.css('.ama-add-collaborator-btn'));
    readonly collaboratorsList = element(by.css('[data-automation-id="collaborators-list"]'));

    title: string;

    constructor(title?: string) {
        super('Are you sure?');
        this.title = title;
    }

    async getCollaborators(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.collaboratorsList);
        return this.collaborators.getText();
    }

    async reject(): Promise<void> {
        await BrowserActions.click(this.closeButton);
    }

    async searchCollaboratorAndSelect(username: string): Promise<void> {
      await BrowserActions.clearSendKeys(this.peopleCloudSearch, username);
      await BrowserVisibility.waitUntilElementIsVisible(this.collaboratorsList);
      await this.selectCollaboratorFromList(username);
    }

    async selectCollaboratorFromList(username: string): Promise<void> {
      const assigneeRow = element(by.cssContainingText('.adf-people-label-name', username));
      await BrowserActions.click(assigneeRow);
      await BrowserVisibility.waitUntilElementIsNotVisible(assigneeRow);
    }

    async addCollaborator(): Promise<void> {
        await BrowserActions.click(this.addButton);
    }
}
