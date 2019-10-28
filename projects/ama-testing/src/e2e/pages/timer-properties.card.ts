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
import { ProcessPropertiesCard } from './process-properties.card';
import { BrowserVisibility } from '@alfresco/adf-testing';

export class TimerPropertiesCard extends ProcessPropertiesCard {

    readonly timerType = element(by.css('mat-select[data-automation-id="timer-type"] div span span'));
    readonly timerCycle = element.all(by.css('div[class*="timer-cycle"]')).first();
    readonly timerDate = element.all(by.css('div[class*="timer-date"]')).first();
    readonly timerDuration = element.all(by.css('div[class*="timer-duration"]')).first();

    async getTimerType(): Promise<string> {
        return this.timerType.getText();
    }

    async cyclePropertiesAreDisplayed(): Promise<boolean> {
        return BrowserVisibility.waitUntilElementIsVisible(this.timerCycle);
    }

    async datePropertiesAreDisplayed(): Promise<boolean> {
        return BrowserVisibility.waitUntilElementIsVisible(this.timerDate);
    }

    async durationPropertiesAreDisplayed(): Promise<boolean> {
        return BrowserVisibility.waitUntilElementIsVisible(this.timerDuration);
    }

}
