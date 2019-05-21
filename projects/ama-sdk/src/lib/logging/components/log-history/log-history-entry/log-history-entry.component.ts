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

import { Component, Input, ChangeDetectionStrategy, SecurityContext, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LogMessage } from '../../../interfaces';

@Component({
    selector: 'amasdk-log-history-entry',
    templateUrl: './log-history-entry.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogHistoryEntryComponent implements OnInit {

    @Input()
    log: LogMessage;

    message: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {}

    ngOnInit() {
        const sanitizedMessages = this.log.messages
            .map(this.sanitize.bind(this))
            .join('<br />');

        this.message = this.sanitizer.bypassSecurityTrustHtml(sanitizedMessages);
    }

    private sanitize(str: string): string {
        return this.sanitizer.sanitize(SecurityContext.HTML, str);
    }
}
