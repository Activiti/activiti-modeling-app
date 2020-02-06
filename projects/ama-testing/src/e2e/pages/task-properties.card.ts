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
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';
import { SEND_NO_VARIABLES_OPTION, SEND_ALL_VARIABLES_OPTION } from '../util/constants';

export class TaskPropertiesCardPage extends GenericPage {

    readonly assignmentBtn = element(by.css('button[data-automation-id="card-array-item-clickable-icon-assignment"]'));
    /* cspell: disable-next-line */
    readonly dueDatePickerBtn = element(by.css('[data-automation-id="datepickertoggle-dueDate"]'));
    /* cspell: disable-next-line */
    readonly dueDateCurrentDate = element(by.css('.mat-datetimepicker-calendar-body-cell-content.mat-datetimepicker-calendar-body-today'));
    /* cspell: disable-next-line */
    readonly dueDateCurrentDateHour = element(by.css('.mat-datetimepicker-clock-cell.mat-datetimepicker-clock-cell-selected.ng-star-inserted'));
    /* cspell: disable-next-line */
    readonly dueDateCurrentDateMinute = element(by.css('.mat-datetimepicker-clock-minutes .mat-datetimepicker-clock-cell:first-child'));
    /* cspell: disable-next-line */
    readonly mappingTypeSelector = element(by.css(`[data-automation-id="mapping-type"] .mat-select`));

    async setProperty(propertyName: string, value: string): Promise<void> {
        await BrowserActions.click(element(by.css(`[data-automation-id="card-textitem-edit-icon-${propertyName}"]`)));
        await BrowserActions.clearSendKeys(element(by.css(`input[data-automation-id="card-textitem-editinput-${propertyName}"]`)), value);
        await BrowserActions.click(element(by.css(`[data-automation-id="card-textitem-update-${propertyName}"]`)));
    }

    async getProperty(propertyName: string): Promise<string> {
        const property = element(by.css(`[data-automation-id="card-textitem-value-${propertyName}"]`));
        return await property.getText();
    }

    async setDocumentation(value: string): Promise<void> {
        await BrowserActions.click(element(by.css(`[data-automation-id="card-textitem-edit-icon-documentation"]`)));
        /* cspell: disable-next-line */
        await BrowserActions.clearSendKeys(element(by.css('[data-automation-id="card-textitem-edittextarea-documentation"]')), value);
        await BrowserActions.click(element(by.css(`[data-automation-id="card-textitem-update-documentation"]`)));
    }

    async setDueDate(): Promise<void> {
        await BrowserActions.click(this.dueDatePickerBtn);
        await BrowserActions.click(this.dueDateCurrentDate);
        await BrowserActions.click(this.dueDateCurrentDateHour);
        await BrowserActions.click(this.dueDateCurrentDateMinute);
    }

    async getAssignment(): Promise<string> {
        /* cspell: disable-next-line */
        const property = element(by.css(`[data-automation-id="card-arrayitem-chip-1 User"] span`));
        return await property.getText();
    }

    async openAssignmentDialog(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsClickable(this.assignmentBtn);
        await BrowserActions.click(this.assignmentBtn);
    }

    async errorMessageIsDisplayed(errorId: string): Promise<boolean> {
        const error = element(by.css(`[data-automation-id="${errorId}"]`));
        await BrowserVisibility.waitUntilElementIsVisible(error);
        return true;
    }

    async getMappingTypeValue(): Promise<string> {
        const selectorElement = element(by.css(`[data-automation-id="mapping-type"] .mat-select`));
        await BrowserVisibility.waitUntilElementIsVisible(selectorElement);
        return selectorElement.getText();
    }

    async setMappingTypeValue(value: string): Promise<void> {
        const selectorElement = element(by.css(`[data-automation-id="mapping-type"] .mat-select`));
        await BrowserActions.click(selectorElement);

        const option = element(by.cssContainingText('.mat-option-text', value));
        await BrowserActions.click(option);
    }

    async resetMapping(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.mappingTypeSelector);
        await BrowserActions.click(this.mappingTypeSelector);
        const noVariablesOption = element(by.cssContainingText('.mat-option-text', SEND_NO_VARIABLES_OPTION));
        await BrowserActions.click(this.mappingTypeSelector);
        await BrowserVisibility.waitUntilElementIsVisible(this.mappingTypeSelector);
        await BrowserActions.click(noVariablesOption);
        await BrowserVisibility.waitUntilElementIsVisible(this.mappingTypeSelector);
        await BrowserActions.click(this.mappingTypeSelector);
        const allVariablesOption = element(by.cssContainingText('.mat-option-text', SEND_ALL_VARIABLES_OPTION));
        await BrowserActions.click(this.mappingTypeSelector);
        await BrowserVisibility.waitUntilElementIsVisible(this.mappingTypeSelector);
        await BrowserActions.click(allVariablesOption);
    }

    async setPriorityValue(value: string): Promise<void> {
        await BrowserActions.click(element(by.css(`[data-automation-id="header-priority"] .mat-select`)));

        const option = element(by.cssContainingText('.mat-option-text', value));
        await BrowserActions.click(option);
    }

    async getSelectedFormName(): Promise<string> {
        const selectedFormNameElement = element(by.css(`mat-select[data-automation-id="form-selector"] div span span`));
        await BrowserVisibility.waitUntilElementIsVisible(selectedFormNameElement);
        return selectedFormNameElement.getText();
    }

    async getSelectedPriority(): Promise<string> {
        const selectedFormNameElement = element(by.css(`[data-automation-id="header-priority"] .mat-select div span span`));
        await BrowserVisibility.waitUntilElementIsVisible(selectedFormNameElement);
        return await selectedFormNameElement.getText();
    }

}
