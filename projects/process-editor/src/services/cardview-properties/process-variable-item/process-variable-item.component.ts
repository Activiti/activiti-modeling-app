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

import { Component, Input, ViewEncapsulation } from '@angular/core';
import { OpenProcessVariablesDialogAction } from './../../../store/process-variables.actions';
import { Store } from '@ngrx/store';
import { CardItemTypeService } from '@alfresco/adf-core';
import { ProcessEntitiesState } from '../../../store/process-entities.state';

@Component({
    /* cspell: disable-next-line */
    selector: 'ama-processvariables',
    templateUrl: './process-variable-item.component.html',
    styleUrls: ['./process-variable-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [CardItemTypeService]
})

export class CardViewProcessVariablesItemComponent {

    @Input() property;

    constructor(private store: Store<ProcessEntitiesState>) { }

    openProcessVariablesDialog(): void {
        this.store.dispatch(new OpenProcessVariablesDialogAction(this.property.value));
    }
}
