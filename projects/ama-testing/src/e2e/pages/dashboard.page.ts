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

import { element, by, ElementFinder } from 'protractor';
import { GenericPage } from './common/generic.page';
import { Pagination } from './pagination.component';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class DashboardPage extends GenericPage {

    readonly dashboardList = element(by.css(`mat-table.dashboard-list`));
    readonly releaseList = element(by.tagName(`ama-release-list`));
    private pagination = new Pagination();

    async isDashboardListDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.dashboardList);
    }

    async isProjectNameInList(projectName: string) {
        const projectItem = element(by.cssContainingText(`mat-cell.mat-column-name`, projectName));
        return await this.isProjectInListWithPageNavigation(projectItem);
    }

    async getIdForProjectByItsName(projectName: string) {
        const projectItemColumn = element(by.css(`mat-cell.mat-column-name[data-project-name="${projectName}"]`));
        await this.isProjectInListWithPageNavigation(projectItemColumn);
        return await projectItemColumn.getAttribute('data-project-id');
    }

    async isProjectInList(projectId: string) {
        const project = this.getProject(`project-${projectId}`);
        return await this.isProjectInListWithPageNavigation(project);
    }

    async isProjectNotInList(projectId: string) {
        const project = this.getProject(`project-${projectId}`);
        return await this.isProjectNotInListWithPageNavigation(project);
    }

    async isProjectVersionUpdated(projectId: string, version: number) {
        const projectVersion = element(by.cssContainingText(`[data-automation-id="project-version-${projectId}"]`, version.toString()));
        return await BrowserVisibility.waitUntilElementIsVisible(projectVersion);
    }

    async isProjectReleaseVisible(releaseId: string) {
        const projectRelease = element(by.css(`[data-automation-id="project-release-id-${releaseId}"]`));
        return await BrowserVisibility.waitUntilElementIsVisible(projectRelease);
    }

    async isProjectReleaseEmpty() {
        const emptyList = element(by.css(`[data-automation-id="project-releases-empty"]`));
        return await BrowserVisibility.waitUntilElementIsVisible(emptyList);
    }

    async navigateToProject(projectId: string) {
        const project = this.getProject(`project-${projectId}`);
        try {
            if (await this.isProjectInListWithPageNavigation(project)) {
                await BrowserActions.click(project);
            } else {
                throw new Error(`Unable to find project '${projectId}'.`);
            }
        } catch (error) {
            throw new Error(`Unable to navigate to project '${projectId}'.\n ${error}`);
        }
    }

    async isProjectInListWithPageNavigation(project: ElementFinder) {
        try {
            if (!(await project.isPresent()) && (await this.pagination.isOnLastPage() == null)) {
                await this.pagination.set1000ItemsPerPage();
            }
            return await BrowserVisibility.waitUntilElementIsPresent(project);
        } catch (error) {
            throw new Error(`Project '${project.locator()}' not found.\n ${error}`);
            return false;
        }
    }

    async isProjectNotInListWithPageNavigation(project: ElementFinder) {
        try {
            if (!(await project.isPresent()) && (await this.pagination.isOnLastPage() == null)) {
                await this.pagination.set1000ItemsPerPage();
            }
            return await BrowserVisibility.waitUntilElementIsNotPresent(project);
        } catch (error) {
            throw new Error(`Project '${project.locator()}' not found.\n ${error}`);
            return false;
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

    async releaseProject(projectId: string) {
        await this.openContextMenuFor(projectId);
        const projectReleaseButton = this.getProject(`project-release-${projectId}`);
        await BrowserActions.click(projectReleaseButton);
    }

    async navigateToReleaseView(projectId: string) {
        await this.openContextMenuFor(projectId);
        const projectReleasesButton = this.getProject(`project-releases-${projectId}`);
        await BrowserActions.click(projectReleasesButton);
        await BrowserVisibility.waitUntilElementIsVisible(this.releaseList);
    }

    private getProject(dataAutomationId: string) {
        return element(by.css(`[data-automation-id="${dataAutomationId}"]`));
    }

    private async openContextMenuFor(projectId: string) {
        const project = this.getProject(`project-${projectId}`);
        try {
            if (await this.isProjectInListWithPageNavigation(project)) {
                const projectContextMenu = this.getProject(`project-context-${projectId}`);
                await BrowserActions.click(projectContextMenu);
            } else {
                throw new Error(`Unable to find project '${projectId}'.`);
            }
        } catch (error) {
            throw new Error(`Unable to open context menu for project '${projectId}'.\n ${error}`);
        }
    }

    private async clickOnEditContextItemFor(projectId: string) {
        const projectEditButton = this.getProject(`project-edit-${projectId}`);
        await BrowserActions.click(projectEditButton);
    }

    private async clickOnDeleteContextItemFor(projectId: string) {
        const projectDeleteButton = this.getProject(`project-delete-${projectId}`);
        await BrowserActions.click(projectDeleteButton);
    }

    async navigateTo() {
        await super.navigateTo(`dashboard/projects`);
    }
}
