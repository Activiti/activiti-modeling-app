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

import { element, by, ElementFinder, browser } from 'protractor';
import { GenericPage } from './common/generic.page';
import { Pagination } from './pagination.component';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class DashboardPage extends GenericPage {

    readonly dashboardList = element(by.css(`.dashboard-list mat-table`));
    readonly releaseList = element(by.tagName(`ama-release-list`));
    /* cspell: disable-next-line */
    readonly dashboardEmptyList = element(by.css('.dashboard-emptylist'));
    private pagination = new Pagination();

    async isDashboardListDisplayed(): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(this.dashboardList);
            return true;
        } catch { return false; }
    }

    async isDashboardListHidden(): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsNotVisible(this.dashboardList);
            return true;
        } catch { return false; }
    }

    async isDashboardListEmpty(): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(this.dashboardEmptyList);
            return true;
        } catch {
            return false;
        }
    }

    async isProjectNameInList(projectName: string): Promise<boolean | void> {
        const projectItem = element(by.cssContainingText(`mat-cell.mat-column-name`, projectName));
        return this.isProjectInListWithPageNavigation(projectItem);
    }

    async getIdForProjectByItsName(projectName: string): Promise<string> {
        const projectItemColumn = element(by.css(`mat-cell.mat-column-name[data-project-name="${projectName}"]`));
        await this.isProjectInListWithPageNavigation(projectItemColumn);
        return projectItemColumn.getAttribute('data-project-id');
    }

    async isProjectInList(projectId: string): Promise<boolean | void> {
        const project = this.getProject(`project-${projectId}`);
        return this.isProjectInListWithPageNavigation(project);
    }

    async isProjectInPaginatedList(projectId: string): Promise<boolean | void> {
        const project = this.getProject(`project-${projectId}`);
        return this.isProjectInListWithoutPageNavigation(project);
    }

    async isProjectNotInList(projectId: string): Promise<boolean | void> {
        const project = this.getProject(`project-${projectId}`);
        return this.isProjectNotInListWithPageNavigation(project);
    }

    async isProjectVersionUpdated(projectId: string, version: number): Promise<boolean> {
        const projectVersion = element(by.cssContainingText(`[data-automation-id="project-version-${projectId}"]`, version.toString()));
        return BrowserVisibility.waitUntilElementIsVisible(projectVersion);
    }

    async isProjectReleaseVisible(releaseId: string): Promise<boolean> {
        const projectRelease = element(by.css(`[data-automation-id="project-release-id-${releaseId}"]`));
        return BrowserVisibility.waitUntilElementIsVisible(projectRelease);
    }

    async isProjectReleaseEmpty(): Promise<boolean> {
        const emptyList = element(by.css(`[data-automation-id="project-releases-empty"]`));
        return BrowserVisibility.waitUntilElementIsVisible(emptyList);
    }

    async getProjectsCount(): Promise<number> {
        await this.isDashboardListDisplayed();
        const projectsList = element.all(by.css(`.mat-column-name[data-automation-id^="project-"]`));
        return projectsList.count();
    }

    async navigateToProject(projectId: string): Promise<void> {
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

    async isProjectInListWithoutPageNavigation(project: ElementFinder): Promise<void | boolean> {
        try {
            return BrowserVisibility.waitUntilElementIsPresent(project);
        } catch (error) {
            throw new Error(`Project '${project.locator()}' not found.\n ${error}`);
        }
    }

    async isProjectInListWithPageNavigation(project: ElementFinder): Promise<void | boolean> {
        try {
            if (!(await project.isPresent()) && (await this.pagination.isOnLastPage() == null)) {
                await this.pagination.set1000ItemsPerPage();
            }
            return BrowserVisibility.waitUntilElementIsPresent(project);
        } catch (error) {
            throw new Error(`Project '${project.locator()}' not found.\n ${error}`);
        }
    }

    async isProjectNotInListWithPageNavigation(project: ElementFinder): Promise<void | boolean> {
        try {
            if (!(await project.isPresent()) && (await this.pagination.isOnLastPage() == null)) {
                await this.pagination.set1000ItemsPerPage();
            }
            return BrowserVisibility.waitUntilElementIsNotPresent(project);
        } catch (error) {
            throw new Error(`Project '${project.locator()}' not found.\n ${error}`);
        }
    }

    async editProject(projectId: string): Promise<void> {
        try {
            await this.openContextMenuFor(projectId);
            await this.clickOnEditContextItemFor(projectId);
        } catch (error) {
            throw new Error(`Edit project '${projectId}' failed.\n ${error}`);
        }
    }

    async deleteProject(projectId: string): Promise<void> {
        try {
            await this.openContextMenuFor(projectId);
            await this.clickOnDeleteContextItemFor(projectId);
        } catch (error) {
            throw new Error(`Delete project '${projectId}' failed.\n ${error}`);
        }
    }

    async releaseProject(projectId: string): Promise<void> {
        await this.openContextMenuFor(projectId);
        const projectReleaseButton = this.getProject(`project-release-${projectId}`);
        await BrowserActions.click(projectReleaseButton);
    }

    async navigateToReleaseView(projectId: string): Promise<void> {
        await this.openContextMenuFor(projectId);
        const projectReleasesButton = this.getProject(`project-releases-${projectId}`);
        await BrowserActions.click(projectReleasesButton);
        await BrowserVisibility.waitUntilElementIsVisible(this.releaseList);
    }

    private getProject(dataAutomationId: string) {
        return element(by.css(`[data-automation-id="${dataAutomationId}"]`));
    }

    private async openContextMenuFor(projectId: string): Promise<void> {
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

    private async clickOnEditContextItemFor(projectId: string): Promise<void> {
        const projectEditButton = this.getProject(`project-edit-${projectId}`);
        await BrowserActions.click(projectEditButton);
    }

    private async clickOnDeleteContextItemFor(projectId: string): Promise<void> {
        const projectDeleteButton = this.getProject(`project-delete-${projectId}`);
        await BrowserActions.click(projectDeleteButton);
    }

    async navigateTo(): Promise<void> {
        await BrowserActions.getUrl(`${browser.baseUrl}/#/dashboard/projects`);
    }
}
