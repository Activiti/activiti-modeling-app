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

import { Injectable } from '@angular/core';
import { TranslationService } from '@alfresco/adf-core';
import { LogAction } from '../store/logging.actions';
import { LogMessageInitiator, MESSAGE } from '../store/app.state';

@Injectable({ providedIn: 'root'})
export class LogFactoryService {
    constructor(private translation: TranslationService) {}

    private translateMessages(messages: string | string[]): string[] {
        if (messages) {
            messages = Array.isArray(messages) ? messages : [messages];
            return messages.map(message => this.translation.instant(message));
        } else {
            return [];
        }
    }

    logInfo(initiator: LogMessageInitiator, messages: string | string[]): LogAction {
        return new LogAction({
            type: MESSAGE.INFO,
            datetime: new Date(),
            initiator,
            messages: this.translateMessages(messages)
        });
    }

    logWarning(initiator: LogMessageInitiator, messages: string | string[]): LogAction {
        return new LogAction({
            type: MESSAGE.WARN,
            datetime: new Date(),
            initiator,
            messages: this.translateMessages(messages)
        });
    }

    logError(initiator: LogMessageInitiator, messages: string | string[]): LogAction {
        return new LogAction({
            type: MESSAGE.ERROR,
            datetime: new Date(),
            initiator,
            messages: this.translateMessages(messages)
        });
    }
}
