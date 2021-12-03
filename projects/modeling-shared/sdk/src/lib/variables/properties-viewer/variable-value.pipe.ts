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
/* cSpell:disable */
@Pipe({ name: 'variablevalue' })
/* cSpell:enable */
export class VariableValuePipe implements PipeTransform {
    transform(value: any, limit?: number): string {
        if (value === undefined || value === null) {
            return null;
        } else if (typeof value === 'object' && value.uri !== undefined) {
            return this.getEllipsisText(this.getFileNameFromUri(value.uri), limit);
        } else if (typeof value === 'object' && value.uri === undefined) {
            return this.getEllipsisText(JSON.stringify(value), limit);
        } else {
            return this.getEllipsisText(String(value), limit);
        }
    }

    private getFileNameFromUri(uri: string): string {
        return uri.slice('file:/'.length).split('.').slice(0, -1).join('.');
    }

    private getEllipsisText(text: string, limit: number) {
        let result = text;
        if (text && limit && limit > 3) {
            if (text.length > limit) {
                result = text.substring(0, (limit - 3)) + '...';
            }
        }
        return result;
    }
}
