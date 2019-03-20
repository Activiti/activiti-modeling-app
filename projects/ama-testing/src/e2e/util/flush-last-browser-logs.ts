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

import { browser } from 'protractor';
import { Logger } from './logger';

export async function flushLastBrowserLogs(length = 1000) {
    const browserLog = await browser.manage().logs().get('browser');
    const lastNLog = browserLog.reverse().slice(0, length);

    lastNLog.forEach((logEntry) => {
        switch (logEntry.level.name_) {
            case 'SEVERE':
                Logger.error(`${logEntry.timestamp}: ${logEntry.message}`);
            break;

            case 'WARNING':
                Logger.warn(`${logEntry.timestamp}: ${logEntry.message}`);
            break;

            default:
                Logger.log(`${logEntry.timestamp}: ${logEntry.message}`);
        }
    });
}
