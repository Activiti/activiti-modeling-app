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
import { testConfig } from '../test.config';

export class DashboardPage extends GenericPage {

    readonly dashboardURL = `${testConfig.ama.url}${testConfig.ama.port !== '' ? `:${testConfig.ama.port}` : ''}/dashboard/projects`;
    readonly dashboardList = element(by.css(`mat-table.dashboard-list`));

    async isDashboardListDisplayed() {
        await super.waitForElementToBeVisible(this.dashboardList);
    }

    async isProjectNameInList(projectName: string) {
        const projectItem = element(by.cssContainingText(`mat-cell.mat-column-name`, projectName));
        return await super.waitForElementToBeVisible(projectItem);
    }

    async getIdForProjectByItsName(projectName: string) {
        const projectItemColumn = element(by.css(`mat-cell.mat-column-name[data-project-name="${projectName}"]`));
        await super.waitForElementToBeVisible(projectItemColumn);
        return await projectItemColumn.getAttribute('data-project-id');
    }

    async isProjectInList(projectId: string) {
        const projectItem = this.getProject(`project-${projectId}`);
        return await super.waitForElementToBeVisible(projectItem);
    }

    async isProjectNotInList(projectId: string) {
        const projectItem = this.getProject(`project-${projectId}`);
        return await super.waitForElementToBeInVisible(projectItem);
    }

    async navigateToProject(projectId: string) {
        const project = this.getProject(`project-${projectId}`);
        await super.click(project);
    }

    async editProject(projectId: string) {
        await this.openContextMenuFor(projectId);
        await this.clickOnEditContextItemFor(projectId);
    }

    async deleteProject(projectId: string) {
        await this.openContextMenuFor(projectId);
        await this.clickOnDeleteContextItemFor(projectId);
    }

    private getProject(dataAutomationId: string) {
        return element(by.css(`[data-automation-id="${dataAutomationId}"]`));
    }

    private async openContextMenuFor(projectId: string) {
        const projectContextMenu = this.getProject(`project-context-${projectId}`);
        await super.waitForElementToBeVisible(projectContextMenu);
        await super.click(projectContextMenu);
    }

    private async clickOnEditContextItemFor(projectId: string) {
        const projectEditButton = this.getProject(`project-edit-${projectId}`);
        await super.waitForElementToBeVisible(projectEditButton);
        await super.click(projectEditButton);
    }

    private async clickOnDeleteContextItemFor(projectId: string) {
        const projectDeleteButton = this.getProject(`project-delete-${projectId}`);
        await super.waitForElementToBeVisible(projectDeleteButton);
        await super.click(projectDeleteButton);
    }

    async navigateTo() {
        await super.navigateTo(`${this.dashboardURL}`);
    }
}
