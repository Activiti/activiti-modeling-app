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

import { Component } from '@angular/core';
import { OpenProcessMessagesDialogAction } from '../../../store/process-messages.actions';
import { Store } from '@ngrx/store';
import { CardItemTypeService } from '@alfresco/adf-core';
import { ProcessEntitiesState } from '../../../store/process-entities.state';

@Component({
    selector: 'ama-process-messages',
    templateUrl: './process-messages-item.component.html',
    providers: [CardItemTypeService]
})

export class CardViewProcessMessagesItemComponent {
    constructor(private store: Store<ProcessEntitiesState>) {
    }

    openProcessMessagesDialog(): void {
        this.store.dispatch(new OpenProcessMessagesDialogAction());
    }
}
