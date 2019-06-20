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
import { Pagination } from './pagination.component';

export class DashboardPage extends GenericPage {

    readonly dashboardList = element(by.css(`mat-table.dashboard-list`));
    private pagination = new Pagination();

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
        return await this.isProjectInListWithPageNavigation(projectId);
    }

    async isProjectNotInList(projectId: string) {
        return await this.isProjectInListWithPageNavigation(projectId);
    }

    async navigateToProject(projectId: string) {
        try {
            if (await this.isProjectInListWithPageNavigation(projectId)) {
                await super.click(this.getProject(`project-${projectId}`));
            }
        } catch (error) {
            throw new Error(`Unable to navigate to project '${projectId}'.\n ${error}`);
        }
    }

    async isProjectInListWithPageNavigation(projectId: string) {
        let found = false;
        try {
            const project = this.getProject(`project-${projectId}`);
            if (!(await project.isPresent()) && (await this.pagination.isOnLastPage() == null)) {
                await this.pagination.set1000ItemsPerPage();
            }
            if (await project.isPresent()) {
                found = true;
            }
            return found;
        } catch (error) {
            throw new Error(`Project '${projectId}' not found.\n ${error}`);
        }
    }

    async editProject(projectId: string) {
        try {
            await this.openContextMenuFor(projectId);
            await this.clickOnEditContextItemFor(projectId);
        } catch (error) {
            throw new Error(`Edit project '${projectId}' failed.\n ${error}`);
        }
    }

    async deleteProject(projectId: string) {
        try {
            await this.openContextMenuFor(projectId);
            await this.clickOnDeleteContextItemFor(projectId);
        } catch (error) {
            throw new Error(`Delete project '${projectId}' failed.\n ${error}`);
        }
    }

    private getProject(dataAutomationId: string) {
        return element(by.css(`[data-automation-id="${dataAutomationId}"]`));
    }

    private async openContextMenuFor(projectId: string) {
        try {
            if (await this.isProjectInListWithPageNavigation(projectId)) {
                const projectContextMenu = this.getProject(`project-context-${projectId}`);
                await super.waitForElementToBeVisible(projectContextMenu);
                await super.click(projectContextMenu);
            } else {
                throw new Error(`Unable to find project '${projectId}'.`);
            }
        } catch (error) {
            throw new Error(`Unable to open context menu for project '${projectId}'.\n ${error}`);
        }
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
        await super.navigateTo(`dashboard/projects`);
    }
}
