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
import { CardViewArrayItem, CardViewArrayItemModel } from '@alfresco/adf-core';
import { of } from 'rxjs';

export enum CalledElementTypes {
    Static = 'static',
    Expression = 'expression'
}

@Injectable({
    providedIn: 'root'
})
export class CalledElementService {

    getDisplayValue(calledElement: string): CardViewArrayItem[] {
        const value = [];
        if (this.isExpressionValid(calledElement)) {
            value.push({ icon: 'code', value: 'Expression' });
        } else if (calledElement) {
            value.push({ icon: 'device_hub', value: 'Process' });
        }
        return value;
    }

    createCardViewArrayItem(calledElement: string): CardViewArrayItemModel {
        return new CardViewArrayItemModel({
            label: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.ACTIVITY_NAME',
            value: of(this.getDisplayValue(calledElement)),
            key: 'called-element',
            icon: 'edit',
            default: '',
            clickable: true,
            noOfItemsToDisplay: 1
        });
    }

    getCalledElementType(calledElement: string): string {
        return this.isExpressionValid(calledElement)
            ? CalledElementTypes.Expression
            : CalledElementTypes.Static;
    }

    isExpressionValid(value: string): boolean {
        return value && /\${([^}]+)}/.test(value);
    }
}
