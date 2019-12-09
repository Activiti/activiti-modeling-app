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

export class DateTime extends GenericPage {

    readonly datePicker = element(by.css(`.mat-datetimepicker-calendar`));
    readonly today = element(by.css(`.mat-datetimepicker-calendar-body-today`));
    readonly timePicker = element(by.css('.mat-datetimepicker-clock'));
    readonly hourTime = element.all(by.css('.mat-datetimepicker-clock-hours .mat-datetimepicker-clock-cell')).first();
    readonly minutesTime = element.all(by.css('.mat-datetimepicker-clock-minutes .mat-datetimepicker-clock-cell')).first();

    async waitTillDateDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.datePicker);
    }

    async setToday(): Promise<void> {
        await BrowserActions.click(this.today);
        await BrowserVisibility.waitUntilElementIsVisible(this.timePicker);
    }

    async setTime(): Promise<void> {
        await BrowserActions.click(this.hourTime);
        await BrowserActions.click(this.minutesTime);
    }

}
