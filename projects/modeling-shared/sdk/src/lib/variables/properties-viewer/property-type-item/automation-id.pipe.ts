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

import { Pipe, PipeTransform } from '@angular/core';
import { sanitizeString } from '../../../helpers/public-api';

@Pipe({
    name: 'automationId'
})
export class AutomationIdPipe implements PipeTransform {

    transform(displayName: string, ...args: string[]): string {
        const automationId = args && args.length > 0 ? args[0] : null;
        const prefix = args && args.length > 1 ? args[1] : null;

        return this.getDataAutomationFromDisplayName(displayName, automationId, prefix);
    }

    private getDataAutomationFromDisplayName(displayName: string, automationId: string, prefix?: string): string {
        return (prefix ? prefix + '-' : '')
            .concat(automationId ? automationId + '-' : '')
            .concat(sanitizeString(displayName.trim().toLowerCase().replace(/(\s)+/g, '-')));
    }

}
